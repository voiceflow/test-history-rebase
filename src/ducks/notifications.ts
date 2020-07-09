import axios from 'axios';
import moment from 'moment';
import { createSelector } from 'reselect';

import { createAction, createRootSelector } from '@/ducks/utils';
import { Action, RootReducer, SyncThunk, Thunk } from '@/store/types';
import { MD5 } from '@/utils/crypto';

import * as Account from './account';

export enum NotificationType {
  FEATURE = 'FEATURE',
  UPDATE = 'UPDATE',
  CHANGE = 'CHANGE',
}

export type Notification = {
  id: string;
  type: NotificationType;
  details: string;
  created: string;
  isNew?: boolean;
};

export type NotificationState = {
  forced: Notification | null;
  notifications: Notification[];
};

export const STATE_KEY = 'notifications';
export const INITIAL_STATE: NotificationState = {
  forced: null,
  notifications: [],
};

export const FORCE_NOTIFICATION_KEY = 'FORCE_NOTIFICATION_STATE';

export enum NotifcationAction {
  SET_NOTIFICATIONS = 'SET_NOTIFICATIONS',
  READ_NOTIFICATIONS = 'READ_NOTIFICATIONS',
  FORCE_NOTIFICATION = 'FORCE_NOTIFICATION',
}

// action types

export type SetNotifications = Action<NotifcationAction.SET_NOTIFICATIONS, Notification[]>;

export type ReadNotifications = Action<NotifcationAction.READ_NOTIFICATIONS>;

export type ForceNotification = Action<NotifcationAction.FORCE_NOTIFICATION, Notification>;

export type AnyNotificationAction = SetNotifications | ReadNotifications | ForceNotification;

// reducers

const notificationsReducer: RootReducer<NotificationState, AnyNotificationAction> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case NotifcationAction.SET_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.payload,
      };
    case NotifcationAction.READ_NOTIFICATIONS:
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
    case NotifcationAction.FORCE_NOTIFICATION:
      return {
        ...state,
        forced: action.payload,
      };
    default:
      return state;
  }
};

export default notificationsReducer;

// selectors

export const notificationsStateSelector = createRootSelector(STATE_KEY);

export const notificationsSelector = createSelector([notificationsStateSelector], ({ forced, notifications }) =>
  forced ? [forced, ...notifications] : notifications
);

// action creators

export const setNotifications = (notifications: Notification[]): SetNotifications => createAction(NotifcationAction.SET_NOTIFICATIONS, notifications);

export const markNotificationAsRead = (): ReadNotifications => createAction(NotifcationAction.READ_NOTIFICATIONS);

export const forceNotification = (notification: Notification, isNew?: boolean): ForceNotification =>
  createAction(NotifcationAction.FORCE_NOTIFICATION, { ...notification, isNew });

// side effects

export const forceNotificationIfNew = (notification: Notification): SyncThunk => (dispatch) => {
  // if the user has already received this force notification do not flag it as unread
  const notificationHash = MD5(`${notification.id}${notification.type}${notification.details}`).toString();
  const isNew = notificationHash !== window.localStorage.getItem(FORCE_NOTIFICATION_KEY);

  if (isNew) {
    window.localStorage.setItem(FORCE_NOTIFICATION_KEY, notificationHash);
  }

  dispatch(forceNotification(notification, isNew));
};

export const fetchNotifications = (): Thunk => async (dispatch, getState) => {
  const useId = Account.userIDSelector(getState());

  let {
    data: { rows: notifications, last_checked: lastChecked },
  } = await axios.get(`/product_updates/${useId}`);

  lastChecked = lastChecked ? moment(lastChecked).unix() : 0;

  notifications = notifications.map((notification: Notification) => ({
    ...notification,
    isNew: Math.floor(new Date(notification.created).getTime() / 1000) > lastChecked,
  }));

  dispatch(setNotifications(notifications));
};

export const readNotifications = (): SyncThunk => (dispatch, getState) => {
  const useId = Account.userIDSelector(getState());

  axios.post(`/product_updates/${useId}`);

  dispatch(markNotificationAsRead());
};
