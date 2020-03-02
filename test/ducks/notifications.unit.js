import axios from 'axios';

import * as Account from '@/ducks/account';
import * as Notifications from '@/ducks/notifications';
import * as crypto from '@/utils/crypto';

import suite from './_suite';

const NOTIFICATION = { text: 'support?' };
const NOTIFICATIONS = [{ text: 'hello' }, { text: 'welcome back' }];
const MOCK_STATE = {
  forced: null,
  notifications: NOTIFICATIONS,
};
const FORCED_STATE = { ...MOCK_STATE, forced: { text: 'feedback?' } };

suite(Notifications, MOCK_STATE)(
  'Ducks - Notifications',
  ({ expect, stub, stubLocalStorage, describeReducer, describeSelectors, describeSideEffects }) => {
    describeReducer(({ expectAction }) => {
      describe('setNotifications()', () => {
        it('should replace notifications', () => {
          const notifications = [{ text: 'new!' }, { text: 'recap' }];

          expectAction(Notifications.setNotifications(notifications)).toModify({ notifications });
        });
      });

      describe('markNotificationAsRead()', () => {
        it('should mark notifications as read', () => {
          expectAction(Notifications.markNotificationAsRead()).toModify({
            notifications: [
              { text: 'hello', isNew: false },
              { text: 'welcome back', isNew: false },
            ],
          });
        });

        it('should mark forced notification as read', () => {
          expectAction(Notifications.markNotificationAsRead())
            .withState(FORCED_STATE)
            .toModify({
              notifications: [
                { text: 'hello', isNew: false },
                { text: 'welcome back', isNew: false },
              ],
              forced: { text: 'feedback?', isNew: false },
            });
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
          expect(select(Notifications.notificationsSelector, createState(FORCED_STATE))).to.eql([{ text: 'feedback?' }, ...NOTIFICATIONS]);
        });
      });
    });

    describeSideEffects(({ applyEffect }) => {
      describe('forceNotificationIfNew()', () => {
        const notification = { id: 'abc', type: 'info', details: 'v2 is out' };
        const hashedNotification = 'abc';

        it('should set a new forced notification', async () => {
          const { getItem, setItem } = stubLocalStorage();
          const md5Hash = stub(crypto, 'MD5').returns({ toString: () => hashedNotification });

          const { expectDispatch } = await applyEffect(Notifications.forceNotificationIfNew(notification));

          expect(md5Hash).to.be.calledWithExactly('abcinfov2 is out');
          expect(getItem).to.be.calledWithExactly(Notifications.FORCE_NOTIFICATION_KEY);
          expect(setItem).to.be.calledWithExactly(Notifications.FORCE_NOTIFICATION_KEY, hashedNotification);
          expectDispatch(Notifications.forceNotification(notification, true));
        });

        it('should set an existing forced notification', async () => {
          const { getItem, setItem } = stubLocalStorage(() => hashedNotification);
          stub(crypto, 'MD5').returns({ toString: () => hashedNotification });
          stub(window, 'localStorage').get(() => ({ getItem, setItem }));

          const { expectDispatch } = await applyEffect(Notifications.forceNotificationIfNew(notification));

          expect(setItem).to.not.be.called;
          expectDispatch(Notifications.forceNotification(notification, false));
        });
      });

      describe('fetchNotifications()', () => {
        const userID = '123';
        const lastChecked = new Date('2020/01/01').getTime();
        const notifications = [{ created: lastChecked + 2000 }, { created: lastChecked - 13000 }];

        it('should fetch new notifications from the DB', async () => {
          const get = stub(axios, 'get').returns({ data: { rows: notifications, last_checked: lastChecked } });
          stub(Account, 'userIDSelector').returns(userID);

          const { expectDispatch } = await applyEffect(Notifications.fetchNotifications());

          expect(get).to.be.calledWithExactly(`/product_updates/${userID}`);
          expectDispatch(
            Notifications.setNotifications([
              { created: lastChecked + 2000, isNew: true },
              { created: lastChecked - 13000, isNew: false },
            ])
          );
        });

        it('should fetch new notifications for the first time from the DB', async () => {
          stub(axios, 'get').returns({ data: { rows: notifications, last_checked: null } });
          stub(Account, 'userIDSelector').returns(userID);

          const { expectDispatch } = await applyEffect(Notifications.fetchNotifications());

          expectDispatch(
            Notifications.setNotifications([
              { created: lastChecked + 2000, isNew: true },
              { created: lastChecked - 13000, isNew: true },
            ])
          );
        });
      });

      describe('readNotifications()', () => {
        const userID = '123';

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
