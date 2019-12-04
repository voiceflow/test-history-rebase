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

const ServerEvent = {
  USERS_UPDATE: 'USERS_UPDATE',
};

export const createSubscription = (tabID, browserID, dispatch) => {
  const subscription = client.socket.realtime.createSubscription(tabID, {
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
        dispatch(Router.goToDashboard());
        dispatch(Modal.setError("You've been kicked out of the session"));
      }
    },
    handleSessionTaken: () => dispatch(Realtime.setupActiveDiagramConnection()),
  });

  subscription.on(ServerEvent.USERS_UPDATE, ({ users }) => dispatch(Realtime.updateDiagramViewers(users)));

  return subscription;
};

export const createResourceUpdateHandlers = (dispatch, getState) => ({
  [Realtime.ResourceType.SLOTS]: (data, meta) => dispatch(Slot.replaceSlots(data, meta)),
  [Realtime.ResourceType.INTENTS]: (data, meta) => dispatch(Intent.replaceIntents(data, meta)),
  [Realtime.ResourceType.PRODUCTS]: (data, meta) => dispatch(Product.replaceProducts(data, meta)),
  [Realtime.ResourceType.DISPLAYS]: (data, meta) => dispatch(Display.replaceDisplays(data, meta)),
  [Realtime.ResourceType.SETTINGS]: (data, meta) => {
    dispatch(Skill.updateSkillMeta(data.meta, meta));
    dispatch(Skill.updateActiveSkill({ name: data.skillName }, meta));
  },
  [Realtime.ResourceType.PUBLISH]: (data, meta) => {
    const platform = Skill.activePlatformSelector(getState());
    dispatch(platform === PlatformType.ALEXA ? AlexaPublish.updatePublishInfo(data, meta) : GooglePublish.updatePublishInfo(data, meta));
  },
  [Realtime.ResourceType.FLOWS]: async (data, meta) => {
    const state = getState();
    const getDiagramByID = Diagram.diagramByIDSelector(state);

    if (data.some(({ id }) => !getDiagramByID(id))) {
      const skillID = Skill.activeSkillIDSelector(state);

      await dispatch(Diagram.loadDiagramsForSkill(skillID, meta));
    }
  },
  [Realtime.ResourceType.VARIABLES]: (data, meta) => {
    dispatch(Skill.replaceGlobalVariables(data.globalSet, meta));
    dispatch(VariableSet.replaceVariableSet(data.variableSet, meta));
  },
});

export const createHandlers = (dispatch, getState) => {
  const resourceUpdateHandlers = createResourceUpdateHandlers(dispatch, getState);

  return {
    [Realtime.LOCK_RESOURCE]: ({ targets: [resourceID] }, tabID) => dispatch(Realtime.addResourceLock(resourceID, tabID)),
    [Realtime.UNLOCK_RESOURCE]: ({ targets: [resourceID] }) => dispatch(Realtime.removeResourceLock(resourceID)),
    [Realtime.UPDATE_RESOURCE]: ({ resourceID, data }) => resourceUpdateHandlers[resourceID](data, { receivedAction: true }),
  };
};
