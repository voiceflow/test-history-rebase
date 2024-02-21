import type { Flow } from '@voiceflow/dtos';
import { Actions } from '@voiceflow/sdk-logux-designer';
import { notify, Nullable } from '@voiceflow/ui-next';

import { linksByNodeIDSelector } from '@/ducks/creatorV2';
import { setLastCreatedID } from '@/ducks/diagramV2';
import * as ProjectV2 from '@/ducks/projectV2';
import { waitAsync } from '@/ducks/utils';
import { schemaVersionSelector } from '@/ducks/versionV2/selectors/active';
import { getActiveAssistantContext } from '@/ducks/versionV2/utils';
import type { Thunk } from '@/store/types';
import { convertSelectionToComponent, CreateDiagramWithDataOptions } from '@/utils/diagram.utils';

import { all as getAllFlows } from './selectors';

export const createOne =
  (data: Actions.Flow.CreateData): Thunk<Flow> =>
  async (dispatch, getState) => {
    const state = getState();
    const context = getActiveAssistantContext(state);

    const response = await dispatch(waitAsync(Actions.Flow.CreateOne, { context, data }));

    return response.data;
  };

export const duplicateOne =
  (componentID: string): Thunk<Actions.Flow.DuplicateOne.Response['data']> =>
  async (dispatch, getState) => {
    const state = getState();

    const context = getActiveAssistantContext(state);
    const duplicated = await dispatch(waitAsync(Actions.Flow.DuplicateOne, { context, data: { flowID: componentID } }));

    notify.short.success('Duplicated');

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
    const allFlows = getAllFlows(state);
    const context = getActiveAssistantContext(state);
    const platform = ProjectV2.active.platformSelector(state);
    const projectType = ProjectV2.active.projectTypeSelector(state);
    const schemaVersion = schemaVersionSelector(state);
    const allNodesLinks = options.nodes.flatMap((node) => linksByNodeIDSelector(state, { id: node.id }));
    console.log(options);
    const { name, incomingLinks, outgoingLinks, component } = convertSelectionToComponent(
      platform,
      projectType,
      schemaVersion,
      allNodesLinks,
      options,
      allFlows.length
    );
    console.log(component);
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
