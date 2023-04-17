import './types';

import React from 'react';

import logger from '@/utils/logger';

const CHAT_CLASSNAME = 'sb-chat';
const DUPLICATE_EMAIL_ERROR = 'duplicate-email';
const USER_LOGIN_FUNCTION = 'add-user-and-login';

const getElement = () => document.querySelector<HTMLElement>(`.${CHAT_CLASSNAME}`);

export const isInitialized = () => !!window.SBChat?.initialized;

export const showChat = async () => {
  const el = getElement();
  if (!el) return;

  el.style.display = 'block';
};

export const hideChat = () => {
  const el = getElement();
  if (!el) return;

  el.style.display = 'none';
};

export const identify = async (user: { name: string; email: string; createdAt: string; creatorID: number }) => {
  await window.asyncSBChatReady?.();

  window.SBF?.getActiveUser(true, async () => {
    if (!window.SBF?.activeUser()) {
      window.SBF?.ajax(
        {
          function: USER_LOGIN_FUNCTION,
          settings: { first_name: user.name, email: user.email, password: user.createdAt },
          settings_extra: { 'creator-id': [user.creatorID, 'Creator ID'] },
        },
        (response) => {
          if (!window.SBF?.errorValidation(response) && window.SBUser) {
            window.SBF?.loginCookie(response[1]);
            window.SBF?.activeUser(new window.SBUser(response[0]));
            window.SBChat?.initChat();
          } else if (response[1] === DUPLICATE_EMAIL_ERROR) {
            window.SBF?.login(user.email, user.createdAt, '', '', () => {
              window.SBChat?.initChat();
            });
          } else {
            logger.error('support chat login failed', response);
            hideChat();
          }
        }
      );
    } else {
      window.SBChat?.initChat();
    }
  });
};

export const useSupportChat = () =>
  React.useEffect(() => {
    let cancelled = false;

    window.asyncSBChatReady?.().then(() => {
      // eslint-disable-next-line promise/always-return
      if (cancelled) return;

      showChat();
    });

    return () => {
      cancelled = true;
      hideChat();
    };
  }, []);
