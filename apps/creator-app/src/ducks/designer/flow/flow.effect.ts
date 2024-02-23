import type { Flow } from '@voiceflow/dtos';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Actions } from '@voiceflow/sdk-logux-designer';
import { logger } from '@voiceflow/ui';
import { notify, Nullable } from '@voiceflow/ui-next';

import PageProgressBar, { PageProgress } from '@/components/PageProgressBar';
import { activeDiagramIDSelector, linksByNodeIDSelector } from '@/ducks/creatorV2';
import { setLastCreatedID } from '@/ducks/diagramV2';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Router from '@/ducks/router';
import { waitAsync } from '@/ducks/utils';
import { schemaVersionSelector } from '@/ducks/versionV2/selectors/active';
import { getActiveAssistantContext, getActiveDomainContext } from '@/ducks/versionV2/utils';
import type { Thunk } from '@/store/types';
import { convertSelectionToComponent, CreateDiagramWithDataOptions } from '@/utils/diagram.utils';
import { AsyncActionError } from '@/utils/logux';

import { all as getAllFlows, oneByID } from './selectors';

export const createOne =
  (data: Actions.Flow.CreateData): Thunk<Flow> =>
  async (dispatch, getState) => {
    const state = getState();
    const context = getActiveAssistantContext(state);

    const response = await dispatch(waitAsync(Actions.Flow.CreateOne, { context, data }));

    return response.data;
  };

export const duplicateOne =
  (
    sourceVersionID: string,
    flowID: string,
    { openDiagram = false, notification = false }: { openDiagram?: boolean; notification?: boolean } = {}
  ): Thunk<Actions.Flow.DuplicateOne.Response['data']> =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);
    const duplicated = await dispatch(waitAsync(Actions.Flow.DuplicateOne, { context, data: { flowID, sourceVersionID } }));

    if (openDiagram) {
      await dispatch(Router.goToDiagram(duplicated.data.diagramID));
    }

    dispatch(setLastCreatedID({ id: duplicated.data.diagramID }));

    if (notification) {
      notify.short.success('Duplicated');
    }

    return duplicated.data;
  };

export const patchOne =
  (id: string, patch: Actions.Flow.PatchData): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    await dispatch.sync(Actions.Flow.PatchOne({ context, id, patch }));
  };

export const patchMany =
  (ids: string[], patch: Actions.Flow.PatchData): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    await dispatch.sync(Actions.Flow.PatchMany({ context, ids, patch }));
  };

const goToRootDiagramIfActive =
  (diagramID: string): Thunk =>
  async (dispatch, getState) => {
    // if the user is on the deleted diagram, redirect to root
    const activeDiagramID = activeDiagramIDSelector(getState());

    if (diagramID === activeDiagramID) {
      await dispatch(Router.goToDomainRootDiagram());
    }
  };

export const deleteOne =
  (id: string, goToRootDiagram = false): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const flow = oneByID(state, { id })!;

    if (goToRootDiagram) {
      await dispatch(goToRootDiagramIfActive(flow.diagramID));
    }

    const context = getActiveAssistantContext(state);

    await dispatch.sync(Actions.Flow.DeleteOne({ context, id }));
  };

export const deleteMany =
  (ids: string[]): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    await dispatch.sync(Actions.Flow.DeleteMany({ context, ids }));
  };

interface CreateOneFromSelectionResult {
  name: string;
  diagramID: string;
  outgoingLinkTarget: Nullable<{ nodeID: string; portID: string }>;
  incomingLinkSource: Nullable<{ nodeID: string; portID: string }>;
}

export const createOneFromSelection =
  (options: CreateDiagramWithDataOptions): Thunk<CreateOneFromSelectionResult> =>
  async (dispatch, getState) => {
    const state = getState();
    const allFlows = getAllFlows(state);
    const context = getActiveAssistantContext(state);
    const platform = ProjectV2.active.platformSelector(state);
    const projectType = ProjectV2.active.projectTypeSelector(state);
    const schemaVersion = schemaVersionSelector(state);
    const allNodesLinks = options.nodes.flatMap((node) => linksByNodeIDSelector(state, { id: node.id }));

    const { name, incomingLinks, outgoingLinks, component } = convertSelectionToComponent(
      platform,
      projectType,
      schemaVersion,
      allNodesLinks,
      options,
      allFlows.length
    );

    const { data: flow } = await dispatch(
      waitAsync(Actions.Flow.CreateOne, {
        context,
        data: {
          name,
          description: '',
          folderID: null,
          diagram: component,
        },
      })
    );

    dispatch(setLastCreatedID({ id: flow.diagramID }));

    return {
      name,
      diagramID: flow.diagramID,
      incomingLinkSource: incomingLinks.length === 1 ? incomingLinks[0].source : null,
      outgoingLinkTarget: outgoingLinks.length === 1 ? outgoingLinks[0].target : null,
    };
  };

export const convertOneToTopic =
  (id: string): Thunk =>
  async (dispatch, getState) => {
    PageProgress.start(PageProgressBar.TOPIC_CREATING);

    const state = getState();
    const flow = oneByID(state, { id })!;
    const activeDiagramID = activeDiagramIDSelector(state);
    const domainContext = getActiveDomainContext(state);
    const context = getActiveAssistantContext(state);

    if (flow.diagramID === activeDiagramID) {
      await dispatch(Router.goToDomainRootDiagram());
    }

    try {
      await dispatch(
        waitAsync(Realtime.domain.topicConvertFromComponent, {
          ...domainContext,
          componentID: flow.diagramID,
        })
      );

      await dispatch.sync(Actions.Flow.DeleteOne({ context, id, deleteDiagram: false }));
    } catch (err) {
      if (err instanceof AsyncActionError && err.code === Realtime.ErrorCode.CANNOT_CONVERT_TO_TOPIC) {
        logger.warn(`unable to convert to topic: ${err.message}`);
      } else {
        throw err;
      }
    }

    PageProgress.stop(PageProgressBar.TOPIC_CREATING);
  };
