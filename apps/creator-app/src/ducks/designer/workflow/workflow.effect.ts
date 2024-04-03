import { Nullable } from '@voiceflow/common';
import type { Workflow } from '@voiceflow/dtos';
import { Actions } from '@voiceflow/sdk-logux-designer';
import { notify } from '@voiceflow/ui-next';

import * as Account from '@/ducks/account';
import { linksByNodeIDSelector } from '@/ducks/creatorV2';
import * as Project from '@/ducks/projectV2';
import { schemaVersionSelector } from '@/ducks/versionV2/selectors/active';
import { getActiveAssistantContext } from '@/ducks/versionV2/utils';
import type { Thunk } from '@/store/types';
import { convertSelectionToComponent, DiagramSelectionPayload } from '@/utils/diagram.utils';

import { waitAsync } from '../../utils';
import * as selectors from './selectors';

export const createOne =
  (data: Actions.Workflow.CreateData): Thunk<Workflow> =>
  async (dispatch, getState) => {
    const state = getState();
    const context = getActiveAssistantContext(state);

    const response = await dispatch(waitAsync(Actions.Workflow.CreateOne, { context, data }));

    return response.data;
  };

export const duplicateOne =
  (workflowID: string): Thunk<Actions.Workflow.DuplicateOne.Response['data']> =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);
    const { data } = await dispatch(waitAsync(Actions.Workflow.DuplicateOne, { context, data: { workflowID } }));

    notify.short.success('Duplicated');

    return data;
  };

export const copyPasteMany =
  (request: Actions.Workflow.CopyPasteMany.Request['data']): Thunk<Actions.Workflow.CopyPasteMany.Response['data']> =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);
    const { data } = await dispatch(waitAsync(Actions.Workflow.CopyPasteMany, { context, data: request }));

    return data;
  };

export const patchOne =
  (id: string, patch: Actions.Workflow.PatchData): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    await dispatch.sync(Actions.Workflow.PatchOne({ context, id, patch }));
  };

export const patchMany =
  (ids: string[], patch: Actions.Workflow.PatchData): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    await dispatch.sync(Actions.Workflow.PatchMany({ context, ids, patch }));
  };

export const deleteOne =
  (id: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    await dispatch.sync(Actions.Workflow.DeleteOne({ context, id }));
  };

export const deleteMany =
  (ids: string[]): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);

    await dispatch.sync(Actions.Workflow.DeleteMany({ context, ids }));
  };

export interface CreateOneFromSelectionResult {
  name: string;
  diagramID: string;
  outgoingLinkTarget: Nullable<{ nodeID: string; portID: string }>;
  incomingLinkSource: Nullable<{ nodeID: string; portID: string }>;
}

export const createOneFromSelection =
  ({ selection, data }: { selection: DiagramSelectionPayload; data: Actions.Workflow.CreateData }): Thunk<CreateOneFromSelectionResult> =>
  async (dispatch, getState) => {
    const state = getState();

    const userID = Account.userIDSelector(state);
    const context = getActiveAssistantContext(state);
    const platform = Project.active.platformSelector(state);
    const flowsSize = selectors.count(state);
    const projectType = Project.active.projectTypeSelector(state);
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

    const { data: workflow } = await dispatch(
      waitAsync(Actions.Workflow.CreateOne, {
        data: {
          name: data.name,
          status: null,
          diagram: component,
          folderID: null,
          assigneeID: userID,
          description: data.description,
        },
        context,
      })
    );

    return {
      name: data.name,
      diagramID: workflow.diagramID,
      incomingLinkSource: incomingLinks.length === 1 ? incomingLinks[0].source : null,
      outgoingLinkTarget: outgoingLinks.length === 1 ? outgoingLinks[0].target : null,
    };
  };
