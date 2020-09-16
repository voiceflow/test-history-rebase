import client from '@/client';
import clientV2 from '@/clientV2';
import { FeatureFlag } from '@/config/features';
import * as Feature from '@/ducks/feature';
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

    const dataRefactor = Feature.isFeatureEnabledSelector(getState())(FeatureFlag.DATA_REFACTOR);
    return dataRefactor
      ? await clientV2.api.prototype.createInfo(skillID, diagramID, params)
      : await client.prototype.createInfo(skillID, diagramID, params);
  } catch (error) {
    console.error(error);
    dispatch(setError('Unable to generate share link'));
    return null;
  }
};

export default sharePrototype;
