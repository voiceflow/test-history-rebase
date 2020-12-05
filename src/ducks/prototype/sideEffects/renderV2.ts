import client from '@/client';
import { PlatformType } from '@/constants';
import * as Modal from '@/ducks/modal';
import * as Skill from '@/ducks/skill';
import { DBIntent, DBSlot } from '@/models';
import { Thunk } from '@/store/types';
import { AbortControl, waitJobFinished } from '@/utils/job';

import { log } from '../utils';
import initializePrototypeV2 from './initializeV2';

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
    let platformPrototypeService = client.platform[platform].prototype;

    // remove the prototypeV2 from alexa as part of GENERAL_PROTOTYPE cleanup
    if (platform === PlatformType.ALEXA) {
      platformPrototypeService = client.platform[platform].prototypeV2;
    }

    await platformPrototypeService.run(projectID);

    await waitJobFinished({
      fetchJob: () => platformPrototypeService.getStatus(projectID),
      maxChecks: MAX_CHECKS,
      abortControl,
    });

    if (abortControl.aborted) return;

    const version = await client.api.version.get(versionID);

    let slots: DBSlot[] = [];
    let intents: DBIntent[] = [];

    if (version.prototype && 'slots' in version.prototype.model) {
      slots = version.prototype.model.slots;
      intents = version.prototype.model.intents.map((intent) => ({ ...intent, _platform: PlatformType.GENERAL }));
    }

    dispatch(initializePrototypeV2({ slots, intents }));
  } catch (err) {
    log.error(err);
    dispatch(Modal.setError('Could Not Render Your Test Project'));
  }
};

export default renderPrototype;
