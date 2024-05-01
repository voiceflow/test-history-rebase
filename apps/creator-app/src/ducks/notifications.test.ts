import axios from 'axios';
import { describe, expect, it, vi } from 'vitest';

import type { State } from '@/ducks';

import { createDuckTools } from './_suite';
import * as Notifications from './notifications';

const NOTIFICATIONS = [{ details: 'hello' }, { details: 'welcome back' }] as Notifications.Notification[];
const MOCK_STATE: Notifications.NotificationState = {
  forced: null,
  notifications: NOTIFICATIONS,
};
const FORCED_STATE = { ...MOCK_STATE, forced: { details: 'feedback?' } as Notifications.Notification };

const { describeSelectors, describeReducer, describeEffect } = createDuckTools(Notifications, MOCK_STATE);

describe('Ducks - Notifications', () => {
  describeReducer(Notifications.setNotifications, ({ applyAction }) => {
    it('should replace notifications', () => {
      const notifications = [{ details: 'new!' }, { details: 'recap' }] as Notifications.Notification[];

      const result = applyAction(MOCK_STATE, { notifications });

      expect(result.notifications).toBe(notifications);
    });
  });

  describeReducer(Notifications.markNotificationAsRead, ({ applyAction }) => {
    it('should mark notifications as read', () => {
      const result = applyAction(MOCK_STATE);

      expect(result.notifications).toEqual([
        { details: 'hello', isNew: false },
        { details: 'welcome back', isNew: false },
      ]);
    });

    it('should mark forced notification as read', () => {
      const result = applyAction(FORCED_STATE);

      expect(result.notifications).toEqual([
        { details: 'hello', isNew: false },
        { details: 'welcome back', isNew: false },
      ]);
      expect(result.forced).toEqual({ details: 'feedback?', isNew: false });
    });
  });

  describeSelectors(({ select, createState }) => {
    describe('notificationsSelector()', () => {
      it('should select all notifications', () => {
        expect(select(Notifications.notificationsSelector)).toBe(NOTIFICATIONS);
      });

      it('should select all notifications and forced notification', () => {
        expect(select(Notifications.notificationsSelector, createState(FORCED_STATE))).toEqual([
          { details: 'feedback?' },
          ...NOTIFICATIONS,
        ]);
      });
    });
  });

  describeEffect(Notifications.fetchNotifications, 'fetchNotifications()', ({ applyEffect }) => {
    const userID = 132;
    const rootState = { account: { creator_id: userID } } as State;
    const lastChecked = new Date('2020/01/01').getTime();
    const notifications: Notifications.Notification[] = [
      { created: lastChecked + 2000 },
      { created: lastChecked - 13000 },
    ] as any[];

    it('should fetch new notifications from the DB', async () => {
      const get = vi
        .spyOn(axios, 'get')
        .mockResolvedValue({ data: { rows: notifications, last_checked: lastChecked } } as any);

      const { dispatched } = await applyEffect(rootState);

      expect(get).toBeCalledWith('/product_updates');
      expect(dispatched).toEqual([
        Notifications.setNotifications({
          notifications: [
            { ...notifications[0], isNew: true },
            { ...notifications[1], isNew: false },
          ] as Notifications.Notification[],
        }),
      ]);
    });

    it('should fetch new notifications for the first time from the DB', async () => {
      vi.spyOn(axios, 'get').mockResolvedValue({ data: { rows: notifications, last_checked: null } } as any);

      const { dispatched } = await applyEffect(rootState);

      expect(dispatched).toEqual([
        Notifications.setNotifications({
          notifications: [
            { ...notifications[0], isNew: true },
            { ...notifications[1], isNew: true },
          ] as Notifications.Notification[],
        }),
      ]);
    });
  });

  describeEffect(Notifications.readNotifications, 'readNotifications()', ({ applyEffect }) => {
    const userID = 123;
    const rootState = { account: { creator_id: userID } } as State;

    it('should mark old notifcations as read', async () => {
      const patch = vi.spyOn(axios, 'patch').mockResolvedValue({});
      const { dispatched } = await applyEffect(rootState);

      expect(patch).toBeCalledWith('/product_updates');
      expect(dispatched).toEqual([Notifications.markNotificationAsRead()]);
    });
  });
});
