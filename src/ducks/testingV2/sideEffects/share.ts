import client from '@/client';
import { setError } from '@/ducks/modal';
import { activeDiagramIDSelector, activeSkillIDSelector } from '@/ducks/skill';

import { testingSelector } from '../selectors';
import { TestStatus, TestingThunk } from '../types';

const shareTesting = (): TestingThunk<unknown | null> => async (dispatch, getState) => {
  try {
    const state = getState();
    const projectID = activeDiagramIDSelector(state);
    const skillID = activeSkillIDSelector(state);
    const diagramID = activeDiagramIDSelector(state);

    const {
      context: { variables },
      status,
    } = testingSelector(state);

    let params;
    const store = localStorage.getItem(`TEST_VARIABLES_${projectID}`);
    if (status !== TestStatus.IDLE && store) {
      params = JSON.parse(store);
    } else {
      params = variables;
    }

    return await client.testingV2.createInfo(skillID, diagramID, params);
  } catch (err) {
    dispatch(setError('Unable to generate share link'));
    return null;
  }
};

export default shareTesting;
