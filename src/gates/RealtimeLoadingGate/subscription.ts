import client from '@/client';
import { PlatformType } from '@/constants';
import * as Diagram from '@/ducks/diagram';
import * as Display from '@/ducks/display';
import * as Intent from '@/ducks/intent';
import * as Modal from '@/ducks/modal';
import * as Product from '@/ducks/product';
import * as AlexaPublish from '@/ducks/publish/alexa';
import * as GooglePublish from '@/ducks/publish/google';
import * as Realtime from '@/ducks/realtime';
import * as Router from '@/ducks/router';
import * as Skill from '@/ducks/skill';
import * as Slot from '@/ducks/slot';
import * as VariableSet from '@/ducks/variableSet';
import * as Models from '@/models';
import { ActionPayload, AnyAction, Dispatch, GetState } from '@/store/types';

const ServerEvent = {
  USERS_UPDATE: 'USERS_UPDATE',
};

type UsersUpdate = { users: Record<string, Record<string, string>> };

export const createSubscription = (tabID: string, browserID: string, dispatch: Dispatch) => {
  const subscription = client.socket!.realtime.createSubscription(tabID, {
    onReload: () => dispatch(Realtime.setErrorState()),
    onDisconnect: () => dispatch(Realtime.disconnectRealtime()),
    onReconnect: async () => {
      dispatch(Realtime.connectRealtime());

      await dispatch(Realtime.setupActiveDiagramConnection());
      await dispatch(Realtime.sendRealtimeUpdate(Realtime.reconnectNoop()));
    },
    updateTimestamp: (timestamp) => dispatch(Realtime.updateLastTimestamp(timestamp)),
    handleSessionTakeOver: (data) => {
      if (data.browserID !== browserID) {
        dispatch(Router.goToDashboard() as AnyAction);
        dispatch(Modal.setError("You've been kicked out of the session"));
      }
    },
    handleSessionTaken: () => dispatch(Realtime.setupActiveDiagramConnection()),
  });

  subscription.on<UsersUpdate>(ServerEvent.USERS_UPDATE, ({ users }) => dispatch(Realtime.updateDiagramViewers(users)));

  return subscription;
};

export const createResourceUpdateHandlers = (dispatch: Dispatch, getState: GetState) => ({
  [Realtime.ResourceType.SLOTS]: (data: Models.Slot[], meta: object) => dispatch(Slot.replaceSlots(data, meta)),
  [Realtime.ResourceType.INTENTS]: (data: Models.Intent[], meta: object) => dispatch(Intent.replaceIntents(data, meta)),
  [Realtime.ResourceType.PRODUCTS]: (data: Models.Product[], meta: object) => dispatch(Product.replaceProducts(data, meta)),
  [Realtime.ResourceType.DISPLAYS]: (data: Models.Display[], meta: object) => dispatch(Display.replaceDisplays(data, meta)),
  [Realtime.ResourceType.SETTINGS]: (data: { skillName: string; meta: unknown }, meta: object) => {
    dispatch(Skill.updateSkillMeta(data.meta, meta));
    dispatch(Skill.updateActiveSkill({ name: data.skillName }, meta));
  },
  [Realtime.ResourceType.PUBLISH]: (data: unknown, meta: object) => {
    const platform = Skill.activePlatformSelector(getState());
    dispatch(platform === PlatformType.ALEXA ? AlexaPublish.updatePublishInfo(data, meta) : GooglePublish.updatePublishInfo(data, meta));
  },
  [Realtime.ResourceType.FLOWS]: async (data: Models.Diagram[], meta: object) => {
    const state = getState();
    const getDiagramByID = Diagram.diagramByIDSelector(state);

    if (data.some(({ id }) => !getDiagramByID(id))) {
      const skillID = Skill.activeSkillIDSelector(state);

      await dispatch(Diagram.loadDiagramsForSkill(skillID, meta));
    }
  },
  [Realtime.ResourceType.VARIABLES]: (data: { globalSet: string[]; variableSet: Record<string, string[]> }, meta: object) => {
    dispatch(Skill.replaceGlobalVariables(data.globalSet, meta));
    dispatch(VariableSet.replaceVariableSet(data.variableSet, meta));
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
