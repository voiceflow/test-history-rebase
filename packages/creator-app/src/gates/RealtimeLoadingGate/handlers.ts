import { batch } from 'react-redux';

import * as Diagram from '@/ducks/diagram';
import * as Intent from '@/ducks/intent';
import * as Product from '@/ducks/product';
import * as Project from '@/ducks/project';
import * as Realtime from '@/ducks/realtime';
import * as Session from '@/ducks/session';
import * as Slot from '@/ducks/slot';
import * as Version from '@/ducks/version';
import * as Models from '@/models';
import { ActionPayload, AnyAction, Dispatch, GetState } from '@/store/types';

export const createResourceUpdateHandlers = (dispatch: Dispatch, getState: GetState) => ({
  [Realtime.ResourceType.SLOTS]: (data: Models.Slot[], meta: object) => dispatch(Slot.replaceSlots(data, meta)),
  [Realtime.ResourceType.INTENTS]: (data: Models.Intent[], meta: object) => dispatch(Intent.replaceIntents(data, meta)),
  [Realtime.ResourceType.PRODUCTS]: (data: Models.Product[], meta: object) => dispatch(Product.replaceProducts(data, meta)),
  [Realtime.ResourceType.SETTINGS]: (data: { name: string } & Pick<Version.AnyVersion, 'settings' | 'publishing' | 'session'>, meta: object) => {
    batch(() => {
      dispatch(Version.patchActiveVersion({ settings: data.settings, publishing: data.publishing, session: data.session }, meta));
      dispatch(Project.updateActiveProjectName(data.name, meta));
    });
  },
  [Realtime.ResourceType.FLOWS]: async (data: Models.Diagram[]) => {
    const state = getState();
    const getDiagramByID = Diagram.diagramByIDSelector(state);

    if (data.some(({ id }) => !getDiagramByID(id))) {
      const versionID = Session.activeVersionIDSelector(state);
      const rootDiagramID = Version.activeRootDiagramIDSelector(state);

      if (!versionID || !rootDiagramID) return;

      await dispatch(Diagram.loadDiagrams(versionID, rootDiagramID));
    }
  },
  [Realtime.ResourceType.VARIABLES]: (data: string[], meta: object) => {
    dispatch(Version.replaceGlobalVariables(data, meta));
  },
  [Realtime.ResourceType.DIAGRAM]: (data: Models.Diagram | null, meta: object) => {
    if (data) {
      dispatch(Diagram.updateDiagram(data.id, { ...data }, true, meta));
    }
  },
});

export const createHandlers = (dispatch: Dispatch, getState: GetState) => {
  const resourceUpdateHandlers = createResourceUpdateHandlers(dispatch, getState);

  return {
    [Realtime.SocketAction.LOCK_RESOURCE]: ({ targets: [resourceID] }: ActionPayload<Realtime.LockResource>, tabID: string) =>
      dispatch(Realtime.addResourceLock(resourceID, tabID)),
    [Realtime.SocketAction.UNLOCK_RESOURCE]: ({ targets: [resourceID] }: ActionPayload<Realtime.UnlockResource>) =>
      dispatch(Realtime.removeResourceLock(resourceID)),
    [Realtime.SocketAction.UPDATE_RESOURCE]: ({ resourceID, data }: ActionPayload<Realtime.UpdateResource>) =>
      resourceUpdateHandlers[resourceID](data as any, { receivedAction: true }),
  } as Record<string, (payload: any, tabID: string) => Promise<void> | AnyAction>;
};
