import client from '@/client';
import { FeatureFlag } from '@/config/features';
import { PlatformType } from '@/constants';
import * as Feature from '@/ducks/feature';
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
  const isGeneralPrototypeEnabled = Feature.isFeatureEnabledSelector(state)(FeatureFlag.GENERAL_PROTOTYPE);

  if (!projectID) {
    return;
  }

  try {
    const platformServices = isGeneralPrototypeEnabled ? client.platform[platform] : client.platform.alexa;

    await platformServices.prototype.run(projectID);

    await waitJobFinished({
      fetchJob: () => platformServices.prototype.getStatus(projectID),
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
