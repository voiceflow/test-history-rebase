import axios from 'axios';
import moment from 'moment';
import { createSelector } from 'reselect';

import { createAction, createRootSelector } from '@/ducks/utils';
import { MD5 } from '@/utils/crypto';

import { userIDSelector } from './account';

export const STATE_KEY = 'notifications';
export const INITIAL_STATE = {
  forced: null,
  notifications: [],
};

export const FORCE_NOTIFICATION_KEY = 'FORCE_NOTIFICATION_STATE';

// actions

export const SET_NOTIFICATIONS = 'SET_NOTIFICATIONS';
export const READ_NOTIFICATIONS = 'READ_NOTIFICATIONS';
export const FORCE_NOTIFICATION = 'FORCE_NOTIFICATION';

// reducers

export default function notificationsReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.payload,
      };
    case READ_NOTIFICATIONS:
      return {
        ...state,
        notifications: state.notifications.map((notification) => ({ ...notification, isNew: false })),
        forced: state.forced
          ? {
              ...state.forced,
              isNew: false,
            }
          : null,
      };
    case FORCE_NOTIFICATION:
      return {
        ...state,
        forced: action.payload,
      };
    default:
      return state;
  }
}

// selectors

export const notificationsStateSelector = createRootSelector(STATE_KEY);

export const notificationsSelector = createSelector(notificationsStateSelector, ({ forced, notifications }) =>
  forced ? [forced, ...notifications] : notifications
);

// action creators

export const setNotifications = (notifications) => createAction(SET_NOTIFICATIONS, notifications);

export const markNotificationAsRead = () => createAction(READ_NOTIFICATIONS);

export const forceNotification = (notification, isNew) => createAction(FORCE_NOTIFICATION, { ...notification, isNew });

// side effects

export const forceNotificationIfNew = (notification) => (dispatch) => {
  // if the user has already received this force notification do not flag it as unread
  const notificationHash = MD5(`${notification.id}${notification.type}${notification.details}`).toString();
  const isNew = notificationHash !== window.localStorage.getItem(FORCE_NOTIFICATION_KEY);

  if (isNew) {
    window.localStorage.setItem(FORCE_NOTIFICATION_KEY, notificationHash);
  }

  dispatch(forceNotification(notification, isNew));
};

export const fetchNotifications = () => async (dispatch, getState) => {
  const useId = userIDSelector(getState());

  let {
    data: { rows: notifications, last_checked: lastChecked },
  } = await axios.get(`/product_updates/${useId}`);

  lastChecked = lastChecked ? moment(lastChecked).unix() : 0;

  notifications = notifications.map((notification) => ({
    ...notification,
    isNew: Math.floor(new Date(notification.created) / 1000) > lastChecked,
  }));

  dispatch(setNotifications(notifications));
};

export const readNotifications = () => (dispatch, getState) => {
  const useId = userIDSelector(getState());

  axios.post(`/product_updates/${useId}`);

  dispatch(markNotificationAsRead());
};
