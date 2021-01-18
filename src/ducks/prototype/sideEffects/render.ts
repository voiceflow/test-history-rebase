import client from '@/client';
import * as Modal from '@/ducks/modal';
import * as Skill from '@/ducks/skill';
import { Thunk } from '@/store/types';
import { AbortControl, waitJobFinished } from '@/utils/job';

import { log } from '../utils';
import resetPrototype from './reset';

const MAX_CHECKS = 30;

const renderPrototype = (abortControl: AbortControl): Thunk => async (dispatch, getState) => {
  const state = getState();
  const platform = Skill.activePlatformSelector(state);
  const projectID = Skill.activeProjectIDSelector(state);
  const versionID = Skill.activeSkillIDSelector(state);

  if (!projectID) {
    return;
  }

  try {
    const platformPrototypeService = client.platform[platform].prototype;

    await platformPrototypeService.run(projectID);

    await waitJobFinished({
      fetchJob: () => platformPrototypeService.getStatus(projectID),
      maxChecks: MAX_CHECKS,
      abortControl,
    });

    if (abortControl.aborted) return;

    const prototype = await client.api.version.getPrototype(versionID);

    if (!prototype) throw new Error('version prototype not found');

    dispatch(resetPrototype());
  } catch (err) {
    log.error(err);
    dispatch(Modal.setError('Could Not Render Your Test Project'));
  }
};

export default renderPrototype;
