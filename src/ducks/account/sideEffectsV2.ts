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

export const linkGoogleAccountV2 = (code: string): Thunk<Nullable<Account.Google>> => async (dispatch) => {
  try {
    const google = await clientV2.googleService.session.linkAccount({ code });

    dispatch(updateAccount({ google }));

    return google;
  } catch (err) {
    log.error(err);
    throw err;
  }
};

export const getGoogleAccountV2 = (): Thunk => async (dispatch) => {
  let google: Nullable<Account.Google> = null;

  try {
    google = await clientV2.googleService.session.getAccount();
  } catch (err) {
    log.error(err);
  }

  dispatch(updateAccount({ google }));
};

export const unlinkGoogleAccountV2 = (): Thunk => async (dispatch) => {
  try {
    await clientV2.googleService.session.unlinkAccount();

    dispatch(updateAccount({ google: null }));
  } catch {
    dispatch(Modal.setError('Something went wrong - please refresh your page'));
  }
};

export const linkAmazonAccountV2 = (code: string): Thunk<Nullable<Account.Amazon>> => async (dispatch) => {
  try {
    const amazon = await clientV2.alexaService.session.linkAccount({ code });

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
    amazon = await clientV2.alexaService.session.getAccount();
  } catch (err) {
    log.error(err);
  }

  dispatch(updateAccount({ amazon }));
};

export const unlinkAmazonAccountV2 = (): Thunk => async (dispatch) => {
  try {
    await clientV2.alexaService.session.unlinkAccount();

    dispatch(updateAccount({ amazon: null }));
  } catch {
    dispatch(Modal.setError('Something went wrong - please refresh your page'));
  }
};

export const updateVendorSkillID = (projectID: string, vendorID: string, skillID: string): Thunk => async (dispatch) => {
  try {
    await clientV2.alexaService.project.updateVendorSkillID(projectID, vendorID, skillID);

    dispatch(Skill.updatePublishPlatforms[PlatformType.ALEXA]({ amznID: skillID }));
  } catch (err) {
    dispatch(Modal.setError('Something went wrong - please refresh your page'));
  }
};

export const updateSelectedVendor = (vendorID: string): Thunk => async (dispatch, getState) => {
  const projectID = Skill.activeProjectIDSelector(getState());

  const { skillID } = await clientV2.alexaService.project.updateSelectedVendor(projectID, vendorID);

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
