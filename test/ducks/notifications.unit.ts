import axios from 'axios';

import * as Account from '@/ducks/account';
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

suite(Notifications, MOCK_STATE)(
  'Ducks - Notifications',
  ({ expect, stub, stubLocalStorage, describeReducer, describeSelectors, describeSideEffects }) => {
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
          expect(select(Notifications.notificationsSelector)).to.eq(NOTIFICATIONS);
        });

        it('should select all notifications and forced notification', () => {
          expect(select(Notifications.notificationsSelector, createState(FORCED_STATE))).to.eql([{ details: 'feedback?' }, ...NOTIFICATIONS]);
        });
      });
    });

    describeSideEffects(({ applyEffect }) => {
      describe('forceNotificationIfNew()', () => {
        const notification = { id: 'abc', type: 'UPDATE', details: 'v2 is out' } as Notifications.Notification;
        const hashedNotification = 'abc';

        it('should set a new forced notification', async () => {
          const { getItem, setItem } = stubLocalStorage();
          const md5Hash = stub(crypto, 'MD5').returns({ toString: () => hashedNotification } as any);

          const { expectDispatch } = await applyEffect(Notifications.forceNotificationIfNew(notification));

          expect(md5Hash).to.be.calledWithExactly('abcUPDATEv2 is out');
          expect(getItem).to.be.calledWithExactly(Notifications.FORCE_NOTIFICATION_KEY);
          expect(setItem).to.be.calledWithExactly(Notifications.FORCE_NOTIFICATION_KEY, hashedNotification);
          expectDispatch(Notifications.forceNotification(notification, true));
        });

        it('should set an existing forced notification', async () => {
          const { getItem, setItem } = stubLocalStorage(() => hashedNotification);
          stub(crypto, 'MD5').returns({ toString: () => hashedNotification } as any);
          stub(window, 'localStorage').get(() => ({ getItem, setItem }));

          const { expectDispatch } = await applyEffect(Notifications.forceNotificationIfNew(notification));

          expect(setItem).to.not.be.called;
          expectDispatch(Notifications.forceNotification(notification, false));
        });
      });

      describe('fetchNotifications()', () => {
        const userID = 132;
        const lastChecked = new Date('2020/01/01').getTime();
        const notifications = [{ created: lastChecked + 2000 }, { created: lastChecked - 13000 }];

        it('should fetch new notifications from the DB', async () => {
          const get = stub(axios, 'get').resolves({ data: { rows: notifications, last_checked: lastChecked } } as any);
          stub(Account, 'userIDSelector').returns(userID);

          const { expectDispatch } = await applyEffect(Notifications.fetchNotifications());

          expect(get).to.be.calledWithExactly(`/product_updates/${userID}`);
          expectDispatch(
            Notifications.setNotifications([
              { created: lastChecked + 2000, isNew: true },
              { created: lastChecked - 13000, isNew: false },
            ] as Notifications.Notification[])
          );
        });

        it('should fetch new notifications for the first time from the DB', async () => {
          stub(axios, 'get').resolves({ data: { rows: notifications, last_checked: null } } as any);
          stub(Account, 'userIDSelector').returns(userID);

          const { expectDispatch } = await applyEffect(Notifications.fetchNotifications());

          expectDispatch(
            Notifications.setNotifications([
              { created: lastChecked + 2000, isNew: true },
              { created: lastChecked - 13000, isNew: true },
            ] as Notifications.Notification[])
          );
        });
      });

      describe('readNotifications()', () => {
        const userID = 123;

        it('should mark old notifcations as read', async () => {
          const post = stub(axios, 'post');
          stub(Account, 'userIDSelector').returns(userID);

          const { expectDispatch } = await applyEffect(Notifications.readNotifications());

          expect(post).to.be.calledWithExactly(`/product_updates/${userID}`);
          expectDispatch(Notifications.markNotificationAsRead());
        });
      });
    });
  }
);
