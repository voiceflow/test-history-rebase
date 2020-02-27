import { createSelector } from 'reselect';

import client from '@/client';
import * as Skill from '@/ducks/skill';
import { createAction, createRootSelector } from '@/ducks/utils';
import { activeWorkspaceIDSelector } from '@/ducks/workspace/selectors';

import { OnboardingStage } from './constants';

export * from './constants';

export const STATE_KEY = 'tracking';

const DEFAULT_STATE = {
  onboarding: {},
};

// actions

export const TRACK_ONBOARDING_STAGE = 'TRACK:ONBOARDING:STAGE';
export const TRACK_ONBOARDING_CHOICE = 'TRACK:ONBOARDING:CHOICE';
export const TRACK_SESSION_DURATION = 'TRACK:SESSION:DURATION';
export const TRACK_SESSION_BEGIN = 'TRACK:SESSION:BEGIN';

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
    case TRACK_ONBOARDING_CHOICE:
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

export const trackOnboardingChoice = (key, value) => createAction(TRACK_ONBOARDING_CHOICE, { key, value });

export const trackSessionDuration = (duration) => createAction(TRACK_SESSION_DURATION, duration);

export const trackSessionBegin = () => createAction(TRACK_SESSION_BEGIN);

// side effects

export const trackCanvasTime = (workspaceID, projectID, skillID, duration) => () =>
  client.analytics.trackCanvasTime(workspaceID, projectID, skillID, duration);

export const trackInvitationSent = (workspaceID, email) => () => client.analytics.trackInvitationSent(workspaceID, email);

export const trackInvitationCancelled = (workspaceID, email) => () => client.analytics.trackInvitationCancelled(workspaceID, email);

export const trackInvitationAccepted = (workspaceID, email) => () => client.analytics.trackInvitationAccepted(workspaceID, email);

export const trackProjectOpened = (workspaceID, projectID, skillID) => () => client.analytics.trackProjectOpened(workspaceID, projectID, skillID);

export const trackActiveProjectOpened = () => async (dispatch, getState) => {
  const state = getState();
  const activeSkill = Skill.activeSkillSelector(state);
  const activeWorkspaceID = activeWorkspaceIDSelector(state);

  await dispatch(trackProjectOpened(activeWorkspaceID, activeSkill.projectID, activeSkill.id));
};
