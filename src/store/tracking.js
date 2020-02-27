import Segment, { identifyUser, trackEvent } from '@redux-beacon/segment';
import * as ReduxBeacon from 'redux-beacon';

import { SEGMENT_ENABLED } from '@/config';
import * as Account from '@/ducks/account';
import * as Tracking from '@/ducks/tracking';

const SEGMENT_EVENTS = {
  [Tracking.TRACK_ONBOARDING_STAGE]: identifyUser(({ payload: stage }, prevState, nextState) => {
    const { creator_id, name, email } = Account.userSelector(prevState);
    const onboardingChoices = Tracking.onboardingChoicesSelector(nextState);

    return {
      userId: creator_id,
      traits: {
        name,
        email,
        [Tracking.OnboardingChoice.STAGE]: stage,
        ...onboardingChoices,
      },
    };
  }),

  [Tracking.TRACK_SESSION_DURATION]: trackEvent(({ payload: duration }) => ({
    name: 'Creator Session Duration',
    properties: {
      duration,
    },
  })),

  [Tracking.TRACK_SESSION_BEGIN]: trackEvent(() => ({
    name: 'Begin New Session',
  })),
};

const createTrackingMiddleware = () => {
  const segment = Segment();

  return SEGMENT_ENABLED ? [ReduxBeacon.createMiddleware(SEGMENT_EVENTS, segment)] : [];
};

export default createTrackingMiddleware;
