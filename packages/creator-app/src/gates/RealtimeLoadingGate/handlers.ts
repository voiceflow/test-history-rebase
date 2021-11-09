import { Eventual } from '@voiceflow/common';
import { batch } from 'react-redux';

import * as Errors from '@/config/errors';
import { FeatureFlag } from '@/config/features';
import * as Diagram from '@/ducks/diagram';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as Feature from '@/ducks/feature';
import * as Intent from '@/ducks/intent';
import * as Product from '@/ducks/product';
import * as Project from '@/ducks/project';
import * as Realtime from '@/ducks/realtime';
import * as Session from '@/ducks/session';
import * as Slot from '@/ducks/slot';
import * as Version from '@/ducks/version';
import * as VersionV2 from '@/ducks/versionV2';
import * as Models from '@/models';
import { ActionPayload, AnyAction, Dispatch, GetState, Thunk } from '@/store/types';

const updateActiveProjectName =
  (name: string, meta?: object): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const projectID = Session.activeProjectIDSelector(state);
    const isAtomicActions = Feature.isFeatureEnabledSelector(state)(FeatureFlag.ATOMIC_ACTIONS);

    if (isAtomicActions) return;

    Errors.assertProjectID(projectID);

    dispatch(Project.crud.patch(projectID, { name }, meta));
  };

/**
 * @deprecated none of these handlers are required with the new realtime system
 */
export const createResourceUpdateHandlers = (dispatch: Dispatch, getState: GetState) => ({
  [Realtime.ResourceType.SLOTS]: (data: Models.Slot[], meta: object) => dispatch(Slot.crud.replace(data, meta)),
  [Realtime.ResourceType.INTENTS]: (data: Models.Intent[], meta: object) => dispatch(Intent.replaceIntents(data, meta)),
  [Realtime.ResourceType.PRODUCTS]: (data: Models.Product[], meta: object) => dispatch(Product.replaceProducts(data, meta)),
  [Realtime.ResourceType.SETTINGS]: (data: { name: string } & Pick<Version.AnyVersion, 'settings' | 'publishing' | 'session'>, meta: object) => {
    batch(() => {
      dispatch(Version.patchActiveVersion({ settings: data.settings, publishing: data.publishing, session: data.session }, meta));
      dispatch(updateActiveProjectName(data.name, meta));
    });
  },
  [Realtime.ResourceType.FLOWS]: async (data: Models.Diagram[]) => {
    const state = getState();
    const getDiagramByID = DiagramV2.getDiagramByIDSelector(state);

    if (data.some(({ id }) => !getDiagramByID(id))) {
      const versionID = Session.activeVersionIDSelector(state);
      const rootDiagramID = VersionV2.active.rootDiagramIDSelector(state);

      if (!versionID || !rootDiagramID) return;

      await dispatch(Diagram.loadDiagrams(versionID, rootDiagramID));
    }
  },
  [Realtime.ResourceType.VARIABLES]: (data: string[], meta: object) => {
    dispatch(Version.replaceGlobalVariables(data, meta));
  },
  [Realtime.ResourceType.DIAGRAM]: (data: Models.Diagram | null, meta: object) => {
    if (data) {
      dispatch(Diagram.crud.patch(data.id, { ...data }, meta));
    }
  },
});

export const createHandlers = (dispatch: Dispatch, getState: GetState) => {
  const resourceUpdateHandlers = createResourceUpdateHandlers(dispatch, getState);

  const wrapHandler =
    <T>(handler: (payload: T, tabID: string) => void, feature: FeatureFlag) =>
    (payload: T, tabID: string) => {
      const isAtomicActions = Feature.isFeatureEnabledSelector(getState())(feature);

      if (!isAtomicActions) {
        handler(payload, tabID);
      }
    };

  return {
    [Realtime.SocketAction.LOCK_RESOURCE]: wrapHandler<ActionPayload<Realtime.LockResource>>(
      ({ targets: [resourceID] }, tabID) => dispatch(Realtime.addResourceLock(resourceID, tabID)),
      FeatureFlag.ATOMIC_ACTIONS_PHASE_2
    ),
    [Realtime.SocketAction.UNLOCK_RESOURCE]: wrapHandler<ActionPayload<Realtime.UnlockResource>>(
      ({ targets: [resourceID] }) => dispatch(Realtime.removeResourceLock(resourceID)),
      FeatureFlag.ATOMIC_ACTIONS_PHASE_2
    ),
    [Realtime.SocketAction.UPDATE_RESOURCE]: wrapHandler<ActionPayload<Realtime.UpdateResource>>(
      ({ resourceID, data }) => resourceUpdateHandlers[resourceID](data as any, { receivedAction: true }),
      FeatureFlag.ATOMIC_ACTIONS
    ),
  } as Record<string, (payload: any, tabID: string) => Eventual<void> | AnyAction>;
};
