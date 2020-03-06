import fetch from './fetch';

export type OnboardingSurvey = {};

const onboardingClient = {
  submit: (workspaceID: string, survey: OnboardingSurvey) => fetch.post(`onboard/${workspaceID}`, survey),
};

export default onboardingClient;
