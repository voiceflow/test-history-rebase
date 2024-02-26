import type { Flow } from '@voiceflow/dtos';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Actions } from '@voiceflow/sdk-logux-designer';
import { logger } from '@voiceflow/ui';
import { notify, Nullable } from '@voiceflow/ui-next';

import PageProgressBar, { PageProgress } from '@/components/PageProgressBar';
import { linksByNodeIDSelector } from '@/ducks/creatorV2';
import { setLastCreatedID } from '@/ducks/diagramV2/actions';
import * as ProjectV2 from '@/ducks/projectV2';
import { schemaVersionSelector } from '@/ducks/versionV2/selectors/active';
import { getActiveAssistantContext, getActiveDomainContext } from '@/ducks/versionV2/utils';
import type { Thunk } from '@/store/types';
import { convertSelectionToComponent, CreateDiagramWithDataOptions } from '@/utils/diagram.utils';
import { AsyncActionError } from '@/utils/logux';

import { waitAsync } from '../../utils';
import * as Selectors from './selectors';

export const createOne =
  (data: Actions.Flow.CreateData): Thunk<Flow> =>
  async (dispatch, getState) => {
    const state = getState();
    const context = getActiveAssistantContext(state);

    const response = await dispatch(waitAsync(Actions.Flow.CreateOne, { context, data }));

    return response.data;
  };

export const duplicateOne =
  (flowID: string): Thunk<Actions.Flow.DuplicateOne.Response['data']> =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);
    const duplicated = await dispatch(waitAsync(Actions.Flow.DuplicateOne, { context, data: { flowID } }));

    dispatch(setLastCreatedID({ id: duplicated.data.diagramID }));

    notify.short.success('Duplicated');

    return duplicated.data;
  };

export const copyPasteMany =
  (data: Actions.Flow.CopyPasteMany.Request['data']): Thunk<Actions.Flow.CopyPasteMany.Response['data']> =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);
    const duplicated = await dispatch(waitAsync(Actions.Flow.CopyPasteMany, { context, data }));

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

export const deleteOne =
  (id: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

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
    const allFlows = Selectors.all(state);
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
    const flow = Selectors.oneByID(state, { id });
    const domainContext = getActiveDomainContext(state);
    const context = getActiveAssistantContext(state);

    if (!flow?.diagramID) return;

    try {
      await dispatch(
        waitAsync(Realtime.domain.topicConvertFromComponent, {
          ...domainContext,
          componentID: flow.diagramID,
        })
      );

      await dispatch.sync(Actions.Flow.DeleteOne({ context, id, keepDiagram: true }));
    } catch (err) {
      if (err instanceof AsyncActionError && err.code === Realtime.ErrorCode.CANNOT_CONVERT_TO_TOPIC) {
        logger.warn(`unable to convert to topic: ${err.message}`);
      } else {
        throw err;
      }
    }

    PageProgress.stop(PageProgressBar.TOPIC_CREATING);
  };
