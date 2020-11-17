import client from '@/client';
import { setError } from '@/ducks/modal';
import { activeDiagramIDSelector, activeSkillIDSelector } from '@/ducks/skill';
import { Thunk } from '@/store/types';

import { prototypeSelector } from '../selectors';
import { PrototypeStatus } from '../types';

const sharePrototype = (): Thunk<unknown | null> => async (dispatch, getState) => {
  try {
    const state = getState();
    const projectID = activeDiagramIDSelector(state);
    const skillID = activeSkillIDSelector(state);
    const diagramID = activeDiagramIDSelector(state);

    const {
      context: { variables },
      status,
    } = prototypeSelector(state);

    let params;
    const store = localStorage.getItem(`TEST_VARIABLES_${projectID}`);
    if (status !== PrototypeStatus.IDLE && store) {
      params = JSON.parse(store);
    } else {
      params = variables;
    }

    return await client.prototype.createInfo(skillID, diagramID, params);
  } catch (error) {
    console.error(error);
    dispatch(setError('Unable to generate share link'));
    return null;
  }
};

export default sharePrototype;
