import axios from 'axios';
import dayjs from 'dayjs';
import { createSelector } from 'reselect';

import { createAction, createRootSelector } from '@/ducks/utils';
import { Action, RootReducer, SyncThunk, Thunk } from '@/store/types';

export enum NotificationType {
  FEATURE = 'FEATURE',
  UPDATE = 'UPDATE',
  CHANGE = 'CHANGE',
}

export interface Notification {
  id: string;
  type: NotificationType;
  details: string;
  created: string;
  isNew?: boolean;
}

export interface NotificationState {
  forced: Notification | null;
  notifications: Notification[];
}

export const STATE_KEY = 'notifications';
export const INITIAL_STATE: NotificationState = {
  forced: null,
  notifications: [],
};

export const FORCE_NOTIFICATION_KEY = 'FORCE_NOTIFICATION_STATE';

export enum NotifcationAction {
  SET_NOTIFICATIONS = 'SET_NOTIFICATIONS',
  READ_NOTIFICATIONS = 'READ_NOTIFICATIONS',
}

// action types

export type SetNotifications = Action<NotifcationAction.SET_NOTIFICATIONS, Notification[]>;

export type ReadNotifications = Action<NotifcationAction.READ_NOTIFICATIONS>;

export type AnyNotificationAction = SetNotifications | ReadNotifications;

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

// side effects

export const fetchNotifications = (): Thunk => async (dispatch) => {
  let {
    data: { rows: notifications, last_checked: lastChecked },
  } = await axios.get(`/product_updates`);

  lastChecked = lastChecked ? dayjs(lastChecked).unix() : 0;

  notifications = notifications.map((notification: Notification) => ({
    ...notification,
    isNew: Math.floor(new Date(notification.created).getTime() / 1000) > lastChecked,
  }));

  dispatch(setNotifications(notifications));
};

export const readNotifications = (): SyncThunk => (dispatch) => {
  axios.patch(`/product_updates`);

  dispatch(markNotificationAsRead());
};
