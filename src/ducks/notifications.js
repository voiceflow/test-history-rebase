import axios from 'axios';
import MD5 from 'crypto-js/md5';
import moment from 'moment';
import { createSelector } from 'reselect';

import { createRootSelector } from '@/ducks/utils';

import { userIDSelector } from './account';

const FORCE_NOTIFICATION_KEY = 'FORCE_NOTIFICATION_STATE';

export const SET_NOTIFICATIONS = 'SET_NOTIFICATIONS';
export const READ_NOTIFICATIONS = 'READ_NOTIFICATIONS';
export const FORCE_NOTIFICATION = 'FORCE_NOTIFICATION';

const initialState = {
  forced: null,
  notifications: [],
};

export const STATE_KEY = 'notifications';

export default function notificationsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.payload,
      };
    case READ_NOTIFICATIONS:
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, isNew: false })),
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

// Selectors
export const notificationsStateSelector = createRootSelector(STATE_KEY);

export const notificationsSelector = createSelector(
  notificationsStateSelector,
  ({ forced, notifications }) => (forced ? [forced, ...notifications] : notifications)
);

export const setNotifications = (payload) => ({ type: SET_NOTIFICATIONS, payload });

export const forceNotification = (notification) => (dispatch) => {
  // if the user has already received this force notification do not flag it as unread
  const notificationHash = MD5(`${notification.id}${notification.type}${notification.details}`).toString();
  const isNew = notificationHash !== localStorage.getItem(FORCE_NOTIFICATION_KEY);

  if (isNew) {
    localStorage.setItem(FORCE_NOTIFICATION_KEY, notificationHash);
  }

  dispatch({ type: FORCE_NOTIFICATION, payload: { ...notification, isNew } });
};

export const markNotificationAsRead = () => ({ type: READ_NOTIFICATIONS });

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
