import type { History } from 'history';
import ReactGA from 'react-ga';

import { GA_ENABLED, GOOGLE_ANALYTICS_ID } from '@/config';

export enum Category {
  AUTH_SIGNUP_PAGE = 'auth_signup_page',
}

export enum Action {
  CLICK = 'click',
}

export enum Label {
  SIGN_UP_BUTTON = 'sign_up_button',
}

export const initialize = (history: History) => {
  if (GA_ENABLED) {
    ReactGA.initialize(GOOGLE_ANALYTICS_ID);
    ReactGA.pageview(window.location.pathname);

    // report pageview events
    // TODO: should probably replace this with redux-beacon
    history.listen((location) => {
      ReactGA.set({ page: location.pathname });
      ReactGA.pageview(location.pathname);
    });
  }
};

export const sendEvent = (category: Category, action: Action, label: Label) => {
  if (GA_ENABLED) {
    ReactGA.event({
      category,
      action,
      label,
    });
  }
};
