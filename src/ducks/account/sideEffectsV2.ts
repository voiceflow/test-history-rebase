import clientV2 from '@/clientV2';
import { PlatformType } from '@/constants';
import * as Modal from '@/ducks/modal';
import * as AlexaPublish from '@/ducks/publish/alexa';
import * as Skill from '@/ducks/skill';
import { Account } from '@/models';
import { Thunk } from '@/store/types';
import { Nullable } from '@/types';

import { duckLogger } from '../utils';
import { updateAccount } from './actions';
import { STATE_KEY } from './constants';
import { amazonVendorsSelector } from './selectors';

const log = duckLogger.child(STATE_KEY);

export const linkAmazonAccountV2 = (code: string): Thunk<Nullable<Account.Amazon>> => async (dispatch) => {
  try {
    const amazon = await clientV2.alexaService.linkAmazonAccount(code);

    dispatch(updateAccount({ amazon }));

    return amazon;
  } catch (err) {
    log.error(err);
    throw err;
  }
};

export const getAmazonAccountV2 = (): Thunk => async (dispatch) => {
  let amazon: Nullable<Account.Amazon> = null;

  try {
    amazon = await clientV2.alexaService.getAmazonAccount();
  } catch (err) {
    log.error(err);
  }

  dispatch(updateAccount({ amazon }));
};

export const unlinkAmazonAccountV2 = (): Thunk => async (dispatch) => {
  try {
    await clientV2.alexaService.unlinkAmazonAccount();

    dispatch(updateAccount({ amazon: null }));
  } catch {
    dispatch(Modal.setError('Something went wrong - please refresh your page'));
  }
};

export const updateVendorSkillID = (projectID: string, vendorID: string, skillID: string): Thunk => async (dispatch) => {
  try {
    await clientV2.alexaService.updateVendorSkillID(projectID, vendorID, skillID);

    dispatch(Skill.updatePublishPlatforms[PlatformType.ALEXA]({ amznID: skillID }));
  } catch (err) {
    dispatch(Modal.setError('Something went wrong - please refresh your page'));
  }
};

export const updateSelectedVendor = (vendorID: string): Thunk => async (dispatch, getState) => {
  const projectID = Skill.activeProjectIDSelector(getState());

  const { skillID } = await clientV2.alexaService.updateSelectedVendor(projectID, vendorID);

  dispatch(Skill.updatePublishPlatforms[PlatformType.ALEXA]({ amznID: skillID, vendorId: vendorID }));
};

export const syncSelectedVendor = (): Thunk => async (dispatch, getState) => {
  await dispatch(getAmazonAccountV2());

  const state = getState();
  const vendors = amazonVendorsSelector(state);
  const skillVendor = AlexaPublish.vendorIdSelector(state);

  if (skillVendor && vendors.length && !vendors.find((vendor) => vendor?.id === skillVendor)) {
    await dispatch(updateSelectedVendor(vendors[0]?.id));
  }
};
