import client from '@/clientV2';
import { JobStatus } from '@/constants';
import { PrototypeStageType } from '@/constants/platforms';
import * as Modal from '@/ducks/modal';
import * as Skill from '@/ducks/skill';
import { Thunk } from '@/store/types';
import { delay } from '@/utils/promise';

import { log } from '../utils';
import initializeTest from './initialize';

type AbortControl = { aborted: boolean };

const MAX_CHECKS = 30;

const checkPrototypeRendered = async (projectID: string, abortControl: AbortControl, count = 0) => {
  if (count === MAX_CHECKS) throw new Error('Render Timed Out');
  if (abortControl.aborted) return;

  const job = await client.alexaService.getRenderPrototypeStatus(projectID);

  if (job === null || (job.status === JobStatus.FINISHED && job.stage.type === PrototypeStageType.ERROR)) {
    throw new Error('Job is canceled or finished with error');
  }

  if (job.status === JobStatus.FINISHED && job.stage.type === PrototypeStageType.SUCCESS) return;

  await delay(1000);

  await checkPrototypeRendered(projectID, abortControl, count + 1);
};

const renderPrototype = (abortControl: AbortControl): Thunk => async (dispatch, getState) => {
  const projectID = Skill.activeProjectIDSelector(getState());

  if (!projectID) {
    return;
  }

  try {
    await client.alexaService.renderPrototype(projectID);
    await checkPrototypeRendered(projectID, abortControl);

    if (abortControl.aborted) return;

    dispatch(initializeTest());
  } catch (err) {
    log.error(err);
    dispatch(Modal.setError('Could Not Render Your Test Project'));
  }
};

export default renderPrototype;
