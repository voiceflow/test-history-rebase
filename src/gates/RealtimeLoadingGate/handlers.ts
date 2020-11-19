import * as Diagram from '@/ducks/diagram';
import * as Intent from '@/ducks/intent';
import * as Product from '@/ducks/product';
import * as Realtime from '@/ducks/realtime';
import * as Skill from '@/ducks/skill';
import * as Slot from '@/ducks/slot';
import * as Models from '@/models';
import { ActionPayload, AnyAction, Dispatch, GetState } from '@/store/types';

export const createResourceUpdateHandlers = (dispatch: Dispatch, getState: GetState) => ({
  [Realtime.ResourceType.SLOTS]: (data: Models.Slot[], meta: object) => dispatch(Slot.replaceSlots(data, meta)),
  [Realtime.ResourceType.INTENTS]: (data: Models.Intent[], meta: object) => dispatch(Intent.replaceIntents(data, meta)),
  [Realtime.ResourceType.PRODUCTS]: (data: Models.Product[], meta: object) => dispatch(Product.replaceProducts(data, meta)),
  [Realtime.ResourceType.SETTINGS]: (data: { skillName: string; meta: Partial<Models.FullSkill['meta']> }, meta: object) => {
    dispatch(Skill.updateSkillMeta(data.meta, meta));
    dispatch(Skill.updateActiveSkill({ name: data.skillName }, meta));
  },
  [Realtime.ResourceType.FLOWS]: async (data: Models.Diagram[]) => {
    const state = getState();
    const getDiagramByID = Diagram.diagramByIDSelector(state);

    if (data.some(({ id }) => !getDiagramByID(id))) {
      const skillID = Skill.activeSkillIDSelector(state);

      await dispatch(Diagram.loadVersionDiagrams(skillID));
    }
  },
  [Realtime.ResourceType.VARIABLES]: (data: string[], meta: object) => {
    dispatch(Skill.replaceGlobalVariables(data, meta));
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
