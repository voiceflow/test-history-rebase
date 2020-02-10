import { createSelector } from 'reselect';

import { createAction, createRootSelector } from '@/ducks/utils';

import { OnboardingStage } from './constants';

export * from './constants';

export const STATE_KEY = 'tracking';

const DEFAULT_STATE = {
  onboarding: {},
};

// actions

export const TRACK_ONBOARDING_STAGE = 'TRACK:ONBOARDING:STAGE';
export const TRACK_ONBOARDING_CHOICE_OLD = 'TRACK:ONBOARDING:CHOICE_OLD';
export const TRACK_INVITATION_SENT = 'TRACK:INVITATION:SENT';
export const TRACK_INVITATION_CANCELLED = 'TRACK:INVITATION:CANCELLED';
export const TRACK_INVITATION_ACCEPTED = 'TRACK:INVITATION:ACCEPTED';

// reducers

const trackOnboardingChoiceReducer = (state, { payload: { key, value } }) => ({
  ...state,
  onboarding: {
    ...state.onboarding,
    [key]: value,
  },
});

const trackingReducer = (state = DEFAULT_STATE, action) => {
  // eslint-disable-next-line sonarjs/no-small-switch
  switch (action.type) {
    case TRACK_ONBOARDING_CHOICE_OLD:
      return trackOnboardingChoiceReducer(state, action);
    default:
      return state;
  }
};

export default trackingReducer;

// selectors

const rootSelector = createRootSelector(STATE_KEY);

export const onboardingChoicesSelector = createSelector(rootSelector, ({ onboarding }) => onboarding);

// action creators

export const trackOnboardingStage = (stage) => createAction(TRACK_ONBOARDING_STAGE, stage);
export const trackOnboardingBegin = () => trackOnboardingStage(OnboardingStage.WELCOME);
export const trackOnboardingComplete = () => trackOnboardingStage(OnboardingStage.COMPLETE);

export const trackOnboardingChoice = (key, value) => createAction(TRACK_ONBOARDING_CHOICE_OLD, { key, value });

export const trackInvitationSent = (workspaceID, email) => createAction(TRACK_INVITATION_SENT, { workspaceID, email });

export const trackInvitationCancelled = (workspaceID, email) => createAction(TRACK_INVITATION_CANCELLED, { workspaceID, email });

export const trackInvitationAccepted = (workspaceID, email) => createAction(TRACK_INVITATION_ACCEPTED, { workspaceID, email });
