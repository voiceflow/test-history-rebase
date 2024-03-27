import type { Flow } from '@voiceflow/dtos';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Actions } from '@voiceflow/sdk-logux-designer';
import { logger } from '@voiceflow/ui';
import { notify, Nullable } from '@voiceflow/ui-next';

import PageProgressBar, { PageProgress } from '@/components/PageProgressBar';
import { linksByNodeIDSelector } from '@/ducks/creatorV2';
import * as ProjectV2 from '@/ducks/projectV2';
import { schemaVersionSelector } from '@/ducks/versionV2/selectors/active';
import { getActiveAssistantContext, getActiveDomainContext } from '@/ducks/versionV2/utils';
import type { Thunk } from '@/store/types';
import { convertSelectionToComponent, DiagramSelectionPayload } from '@/utils/diagram.utils';
import { AsyncActionError } from '@/utils/logux';

import { waitAsync } from '../../utils';
import * as selectors from './selectors';

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
    const { data } = await dispatch(waitAsync(Actions.Flow.DuplicateOne, { context, data: { flowID } }));

    notify.short.success('Duplicated');

    return data;
  };

export const copyPasteMany =
  (request: Actions.Flow.CopyPasteMany.Request['data']): Thunk<Actions.Flow.CopyPasteMany.Response['data']> =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);
    const { data } = await dispatch(waitAsync(Actions.Flow.CopyPasteMany, { context, data: request }));

    return data;
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

export interface CreateOneFromSelectionResult {
  name: string;
  diagramID: string;
  outgoingLinkTarget: Nullable<{ nodeID: string; portID: string }>;
  incomingLinkSource: Nullable<{ nodeID: string; portID: string }>;
}

export const createOneFromSelection =
  ({ selection, data }: { selection: DiagramSelectionPayload; data: Actions.Flow.CreateData }): Thunk<CreateOneFromSelectionResult> =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);
    const platform = ProjectV2.active.platformSelector(state);
    const flowsSize = selectors.count(state);
    const projectType = ProjectV2.active.projectTypeSelector(state);
    const schemaVersion = schemaVersionSelector(state);
    const allNodesLinks = selection.nodes.flatMap((node) => linksByNodeIDSelector(state, { id: node.id }));

    const { incomingLinks, outgoingLinks, component } = convertSelectionToComponent({
      platform,
      flowsSize,
      selection,
      projectType,
      schemaVersion,
      allNodesLinks,
    });

    const { data: flow } = await dispatch(
      waitAsync(Actions.Flow.CreateOne, { data: { name: data.name, diagram: component, folderID: null, description: data.description }, context })
    );

    return {
      name: data.name,
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

    const flow = selectors.oneByID(state, { id });
    const context = getActiveAssistantContext(state);
    const domainContext = getActiveDomainContext(state);

    if (!flow?.diagramID) return;

    try {
      await dispatch(
        waitAsync(Realtime.domain.topicConvertFromComponent, {
          ...domainContext,
          componentID: flow.diagramID,
        })
      );

      await dispatch.sync(Actions.Flow.DeleteOne({ context, id }));
    } catch (err) {
      if (err instanceof AsyncActionError && err.code === Realtime.ErrorCode.CANNOT_CONVERT_TO_TOPIC) {
        logger.warn(`unable to convert to topic: ${err.message}`);
      } else {
        throw err;
      }
    }

    PageProgress.stop(PageProgressBar.TOPIC_CREATING);
  };
