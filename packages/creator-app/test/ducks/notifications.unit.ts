import axios from 'axios';

import { State } from '@/ducks';
import * as Notifications from '@/ducks/notifications';
import * as crypto from '@/utils/crypto';

import suite from './_suite';

const NOTIFICATION = { details: 'support?' } as Notifications.Notification;
const NOTIFICATIONS = [{ details: 'hello' }, { details: 'welcome back' }] as Notifications.Notification[];
const MOCK_STATE: Notifications.NotificationState = {
  forced: null,
  notifications: NOTIFICATIONS,
};
const FORCED_STATE = { ...MOCK_STATE, forced: { details: 'feedback?' } as Notifications.Notification };

suite(Notifications, MOCK_STATE)('Ducks - Notifications', ({ mocks, describeReducer, describeSelectors, describeSideEffects }) => {
  describeReducer(({ expectAction }) => {
    describe('setNotifications()', () => {
      it('should replace notifications', () => {
        const notifications = [{ details: 'new!' }, { details: 'recap' }] as Notifications.Notification[];

        expectAction(Notifications.setNotifications(notifications)).toModify({ notifications });
      });
    });

    describe('markNotificationAsRead()', () => {
      it('should mark notifications as read', () => {
        expectAction(Notifications.markNotificationAsRead()).toModify({
          notifications: [
            { details: 'hello', isNew: false },
            { details: 'welcome back', isNew: false },
          ],
        } as Notifications.NotificationState);
      });

      it('should mark forced notification as read', () => {
        expectAction(Notifications.markNotificationAsRead())
          .withState(FORCED_STATE)
          .toModify({
            notifications: [
              { details: 'hello', isNew: false },
              { details: 'welcome back', isNew: false },
            ],
            forced: { details: 'feedback?', isNew: false },
          } as Notifications.NotificationState);
      });
    });

    describe('forceNotification()', () => {
      it('should add forced notification', () => {
        expectAction(Notifications.forceNotification(NOTIFICATION, true)).toModify({ forced: { ...NOTIFICATION, isNew: true } });
        expectAction(Notifications.forceNotification(NOTIFICATION, false)).toModify({ forced: { ...NOTIFICATION, isNew: false } });
      });
    });
  });

  describeSelectors(({ select, createState }) => {
    describe('notificationsSelector()', () => {
      it('should select all notifications', () => {
        expect(select(Notifications.notificationsSelector)).toBe(NOTIFICATIONS);
      });

      it('should select all notifications and forced notification', () => {
        expect(select(Notifications.notificationsSelector, createState(FORCED_STATE))).toEqual([{ details: 'feedback?' }, ...NOTIFICATIONS]);
      });
    });
  });

  describeSideEffects(({ applyEffect }) => {
    describe('forceNotificationIfNew()', () => {
      const notification = { id: 'abc', type: 'UPDATE', details: 'v2 is out' } as Notifications.Notification;
      const hashedNotification = 'abc';

      it('should set a new forced notification', async () => {
        const { getItem, setItem } = mocks.storage('localStorage');
        const md5Hash = vi.spyOn(crypto, 'MD5').mockReturnValue({ toString: () => hashedNotification } as any);

        const { expectDispatch } = await applyEffect(Notifications.forceNotificationIfNew(notification));

        expect(md5Hash).toBeCalledWith('abcUPDATEv2 is out');
        expect(getItem).toBeCalledWith(Notifications.FORCE_NOTIFICATION_KEY);
        expect(setItem).toBeCalledWith(Notifications.FORCE_NOTIFICATION_KEY, hashedNotification);
        expectDispatch(Notifications.forceNotification(notification, true));
      });

      it('should set an existing forced notification', async () => {
        const { setItem } = mocks.storage('localStorage', () => hashedNotification);
        vi.spyOn(crypto, 'MD5').mockReturnValue({ toString: () => hashedNotification } as any);

        const { expectDispatch } = await applyEffect(Notifications.forceNotificationIfNew(notification));

        expect(setItem).not.toBeCalled();
        expectDispatch(Notifications.forceNotification(notification, false));
      });
    });

    describe('fetchNotifications()', () => {
      const userID = 132;
      const lastChecked = new Date('2020/01/01').getTime();
      const notifications: Notifications.Notification[] = [{ created: lastChecked + 2000 }, { created: lastChecked - 13000 }] as any[];
      const rootState = { account: { creator_id: userID } } as State;

      it('should fetch new notifications from the DB', async () => {
        const get = vi.spyOn(axios, 'get').mockResolvedValue({ data: { rows: notifications, last_checked: lastChecked } } as any);

        const { expectDispatch } = await applyEffect(Notifications.fetchNotifications(), rootState as any);

        expect(get).toBeCalledWith(`/product_updates`);
        expectDispatch(
          Notifications.setNotifications([
            { ...notifications[0], isNew: true },
            { ...notifications[1], isNew: false },
          ] as Notifications.Notification[])
        );
      });

      it('should fetch new notifications for the first time from the DB', async () => {
        vi.spyOn(axios, 'get').mockResolvedValue({ data: { rows: notifications, last_checked: null } } as any);

        const { expectDispatch } = await applyEffect(Notifications.fetchNotifications(), rootState as any);

        expectDispatch(
          Notifications.setNotifications([
            { ...notifications[0], isNew: true },
            { ...notifications[1], isNew: true },
          ] as Notifications.Notification[])
        );
      });
    });

    describe('readNotifications()', () => {
      const userID = 123;
      const rootState = { account: { creator_id: userID } } as State;

      it('should mark old notifcations as read', async () => {
        const patch = vi.spyOn(axios, 'patch').mockResolvedValue({});
        const { expectDispatch } = await applyEffect(Notifications.readNotifications(), rootState as any);

        expect(patch).toBeCalledWith(`/product_updates`);
        expectDispatch(Notifications.markNotificationAsRead());
      });
    });
  });
});
