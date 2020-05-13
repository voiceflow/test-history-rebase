import { History } from 'history';
import ReactGA from 'react-ga';

import { GA_ENABLED, GOOGLE_ANALYTICS_ID } from '@/config';

// eslint-disable-next-line import/prefer-default-export
export const initialize = (history: History) => {
  if (GA_ENABLED) {
    ReactGA.initialize(GOOGLE_ANALYTICS_ID);

    // report pageview events
    // TODO: should probably replace this with redux-beacon
    history.listen((location) => {
      ReactGA.set({ page: location.pathname });
      ReactGA.pageview(location.pathname);
    });
  }
};
