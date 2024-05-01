import { Utils } from '@voiceflow/common';
import axios from 'axios';
import dayjs from 'dayjs';
import { createSelector } from 'reselect';

import { createRootReducer, createRootSelector } from '@/ducks/utils';
import type { SyncThunk, Thunk } from '@/store/types';

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

// selectors

export const notificationsStateSelector = createRootSelector(STATE_KEY);

export const notificationsSelector = createSelector([notificationsStateSelector], ({ forced, notifications }) =>
  forced ? [forced, ...notifications] : notifications
);

// action creators

const notificationsType = Utils.protocol.typeFactory('notifications');

export const setNotifications = Utils.protocol.createAction<{ notifications: Notification[] }>(
  notificationsType('SET')
);

export const markNotificationAsRead = Utils.protocol.createAction(notificationsType('READ'));

// reducers

const notificationsReducer = createRootReducer(INITIAL_STATE)
  .mimerCase(setNotifications, (state, { notifications }) => {
    state.notifications = notifications;
  })

  .mimerCase(markNotificationAsRead, (state) => {
    state.notifications = state.notifications.map((notification) => ({ ...notification, isNew: false }));
    state.forced = state.forced ? { ...state.forced, isNew: false } : null;
  })

  .build();

export default notificationsReducer;

// side effects

export const fetchNotifications = (): Thunk => async (dispatch) => {
  let {
    data: { rows: notifications, last_checked: lastChecked },
  } = await axios.get('/product_updates');

  lastChecked = lastChecked ? dayjs(lastChecked).unix() : 0;

  notifications = notifications.map((notification: Notification) => ({
    ...notification,
    isNew: Math.floor(new Date(notification.created).getTime() / 1000) > lastChecked,
  }));

  dispatch(setNotifications({ notifications }));
};

export const readNotifications = (): SyncThunk => (dispatch) => {
  axios.patch('/product_updates');

  dispatch(markNotificationAsRead());
};
