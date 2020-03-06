import client, { OnboardingSurvey } from '@/client';
import * as Workspace from '@/ducks/workspace';
import { Thunk } from '@/store/types';

// side effects

// eslint-disable-next-line import/prefer-default-export
export const submitSurvey = (survey: OnboardingSurvey): Thunk => async (_, getState) => {
  const workspaceID = Workspace.activeWorkspaceIDSelector(getState());

  await client.onboarding.submit(workspaceID, survey);
};
