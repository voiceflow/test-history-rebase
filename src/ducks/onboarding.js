import client from '@/client';

// side effects

// eslint-disable-next-line import/prefer-default-export
export const submitSurvey = (survey) => async () => {
  await client.onboarding.submit(survey);
};
