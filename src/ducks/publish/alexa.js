/* eslint-disable no-await-in-loop */
import axios from 'axios';
import _ from 'lodash';
import randomstring from 'randomstring';
import { createSelector } from 'reselect';

import client from '@/client';
import { PlatformType } from '@/constants';
import { getVendors } from '@/ducks/account';
import { saveActiveDiagram } from '@/ducks/diagram';
import {
  activeLocalesSelector,
  activeProjectIDSelector,
  activeSkillIDSelector,
  invNameSelector,
  publishPlatformSelectors,
  updatePublishPlatforms,
} from '@/ducks/skill';

import { createPublishStateSelector, createUploadStep, invNameError } from './utils';

export { invNameError };

export const PLATFORM = PlatformType.ALEXA;
export const publishInfoSelector = publishPlatformSelectors[PLATFORM];
export const updatePublishInfo = updatePublishPlatforms[PLATFORM];

export const amznIDSelector = createSelector(
  publishInfoSelector,
  ({ amznID }) => amznID
);

export const reviewSelector = createSelector(
  publishInfoSelector,
  ({ review }) => review
);

export const vendorIdSelector = createSelector(
  publishInfoSelector,
  ({ vendorId }) => vendorId
);

/*
  flags:
    end - this is an ending state where the user can't progress any further without reseting and a hidden prompt should show
    checking - indefinite/independent check (waiting for the user to login in to amazon)
    loading - part of a larger loading bar with percentage
*/

export const ALEXA_STATES = {
  IDLE: {
    end: true,
  },
  AMAZON_LOGIN: {
    end: true,
  },
  CHECKING_VENDOR: {
    checking: true,
  },
  NO_VENDOR: {
    end: true,
  },
  INVALID_INV_NAME: {
    end: true,
  },
  RENDERING_ERROR: {
    end: true,
  },
  RENDERING: {
    loading: {
      label: 'Rendering Flows',
      start: 0,
      end: 5,
      time: 1000,
    },
  },
  UPLOADING_ALEXA: {
    loading: {
      label: 'Uploading to Alexa',
      start: 6,
      end: 10,
      time: 1000,
    },
  },
  CHOICE_MODEL: {
    loading: {
      label: 'Building Interaction Model',
      start: 11,
      end: 95,
      time: 40000,
    },
  },
  ENABLING_SKILL: {
    loading: {
      label: 'Enabling Skill',
      start: 95,
      end: 100,
      time: 1000,
    },
  },
  SUBMITTING_SKILL: {
    loading: {
      label: 'Submitting for Review',
      start: 95,
      end: 100,
      time: 1000,
    },
  },
  ALEXA_ERROR: {
    end: true,
  },
  UPLOAD_SUCCESS: {
    end: true,
  },
  SUBMIT_SUCCESS: {
    end: true,
  },
};

/* 
  transform state and properties to normalized dictionary of strings. ie:
  ALEXA_STAGES = {
    IDLE: 'IDLE',
    INVALID_INV_NAME: 'INVALID_INV_NAME',
  } 
*/

export const ALEXA_STAGES = Object.keys(ALEXA_STATES).reduce((stages, name) => {
  stages[name] = name;
  return stages;
}, {});

export const UPDATE_ALEXA = 'publish/alexa/UPDATE';
export const UPDATE_ALEXA_STAGE = 'publish/alexa/stage/UPDATE';
export const UPDATE_ALEXA_ERROR = 'publish/alexa/error/UPDATE';
// eslint-disable-next-line no-secrets/no-secrets
export const UPDATE_ALEXA_OPTIONS = 'publish/alexa/options/UPDATE';

const initialState = {
  stage: ALEXA_STAGES.IDLE,
  error: null,
  options: {},
  id: null,
  // the first locale to build an interaction model
  locale: null,
};

export default function alexaReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_ALEXA:
      return {
        ...state,
        ...action.payload,
      };
    case UPDATE_ALEXA_STAGE:
      if (action.payload in ALEXA_STATES) {
        return {
          ...state,
          stage: action.payload,
        };
      }
      return state;
    case UPDATE_ALEXA_ERROR:
      return {
        ...state,
        stage: ALEXA_STAGES.ALEXA_ERROR,
        error: action.payload,
      };
    case UPDATE_ALEXA_OPTIONS:
      return {
        ...state,
        options: {
          ...state.options,
          ...action.payload,
        },
      };
    default:
      return state;
  }
}

export const updateAlexa = (state) => ({
  type: UPDATE_ALEXA,
  payload: state,
});

export const updateAlexaStage = (stage) => ({
  type: UPDATE_ALEXA_STAGE,
  payload: stage,
});

export const updateAlexaError = (error) => ({
  type: UPDATE_ALEXA_ERROR,
  payload: error,
});

export const updateAlexaOptions = (options) => ({
  type: UPDATE_ALEXA_OPTIONS,
  payload: options,
});

export const resetAlexaUpload = () => (dispatch) => {
  dispatch(updateAlexa(initialState));
};

export const publishStateSelector = createPublishStateSelector(PLATFORM);
const uploadStep = createUploadStep(PLATFORM);

// STEP 8 (optional)
export const submitForReview = () =>
  uploadStep(async (dispatch, getState) => {
    const state = getState();
    const skillID = activeSkillIDSelector(state);
    const amznID = amznIDSelector(state);

    dispatch(updateAlexaStage(ALEXA_STAGES.SUBMITTING_SKILL));

    try {
      await axios.post(`/amazon/${skillID}/${amznID}/certify`);
      dispatch(updatePublishInfo({ review: true }));
      dispatch(updateAlexaStage(ALEXA_STAGES.SUBMIT_SUCCESS));
    } catch (err) {
      console.error(err);
      let errorMessage = 'Certification Error \n';
      if (err?.response?.data?.message) {
        errorMessage += err.response.data.message;
      }
      const violations = err?.response?.data?.violations;
      if (Array.isArray(violations)) {
        for (let i = 0; i < violations.length; i++) errorMessage += `\n${violations[i].message}`;
      }

      dispatch(updateAlexaError(errorMessage));
    }
  });

// UPLOAD SUCCESS
export const uploadSuccess = () =>
  uploadStep(async (dispatch) => {
    dispatch(updateAlexaStage(ALEXA_STAGES.UPLOAD_SUCCESS));
  });

// STEP 7
export const enableSkill = () =>
  uploadStep(async (dispatch, getState) => {
    const state = getState();
    const { amznID } = publishInfoSelector(state);

    dispatch(updateAlexaStage(ALEXA_STAGES.ENABLING_SKILL));
    try {
      await axios.put(`/interaction_model/${amznID}/enable`);
    } catch (err) {
      console.error(err);
    }
    dispatch(uploadSuccess());
  });

// STEP 6
export const checkInteractionModel = () =>
  uploadStep(async (dispatch, getState) => {
    const state = getState();
    // get submit option
    const { options } = publishStateSelector(state);
    const locales = activeLocalesSelector(state);
    const amznID = amznIDSelector(state);

    dispatch(updateAlexaStage(ALEXA_STAGES.CHOICE_MODEL));

    let success = false;
    try {
      // wait up to 60 seconds and even longer if submitting for review
      const checks = options.submit ? 60 : 20;

      for (let i = 0; i < checks; i++) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        const {
          data: { interactionModel = {} },
        } = await axios.get(`/interaction_model/${amznID}/status`);

        // eslint-disable-next-line no-loop-func
        _.forOwn(interactionModel, (metadata, locale) => {
          if (metadata?.lastUpdateRequest?.status === 'SUCCEEDED') {
            success = locale;
            return false;
          }
        });
        if (success) break;
      }
    } catch (err) {
      console.error(err);
    }

    dispatch(updateAlexa({ locale: success || locales[0] }));
    if (options.submit) {
      dispatch(submitForReview());
    } else if (success) {
      dispatch(enableSkill());
    } else {
      dispatch(uploadSuccess());
    }
  });

// STEP 5
export const submitProject = (newVersionId) =>
  uploadStep(async (dispatch, getState) => {
    const projectID = activeProjectIDSelector(getState());
    dispatch(updateAlexaStage(ALEXA_STAGES.UPLOADING_ALEXA));
    try {
      const { data: amznID } = await axios.post(`/project/${projectID}/version/${newVersionId}/alexa`);
      dispatch(updatePublishInfo({ amznID }));
      dispatch(checkInteractionModel());
    } catch (err) {
      if (err?.response?.status === 403) {
        // No Vendor ID/Amazon Developer Account
        dispatch(updateAlexaStage(ALEXA_STAGES.NO_VENDOR));
      } else if (err?.response?.status === 401) {
        dispatch(updateAlexaStage(ALEXA_STAGES.AMAZON_LOGIN));
      } else {
        let errorMessage = '';
        const errorData = err?.response?.data || {};
        const { message, violations } = errorData;
        if (message) {
          errorMessage += err.response.data.message;
        }

        if (violations) {
          violations.forEach(({ message }) => {
            if (message) {
              errorMessage += `\n${message}`;
            }
          });
        }

        if (!errorMessage && _.isString(errorData)) errorMessage = errorData;
        dispatch(updateAlexaError(errorMessage || 'Something went wrong with this upload'));
      }
    }
  });

// STEP 4
export const renderProject = () =>
  uploadStep(async (dispatch, getState) => {
    const projectID = activeProjectIDSelector(getState());

    dispatch(updateAlexaStage(ALEXA_STAGES.RENDERING));
    try {
      await dispatch(saveActiveDiagram());
      const {
        new_skill: { skill_id: newVersionId },
      } = (await axios.post(`/project/${projectID}/render`, { platform: 'alexa' })).data;
      dispatch(submitProject(newVersionId));
    } catch (err) {
      console.error(err);
      dispatch(updateAlexaStage(ALEXA_STAGES.RENDERING_ERROR));
    }
  });

// STEP 3 - check that the skill invocation name is valid
export const checkInvName = () =>
  uploadStep((dispatch, getState) => {
    const state = getState();
    const locales = activeLocalesSelector(state);
    const invName = invNameSelector(state);

    if (invNameError(invName, locales)) return dispatch(updateAlexaStage(ALEXA_STAGES.INVALID_INV_NAME));
    dispatch(renderProject());
  });

// STEP 2 - check that user has vendors (developer account) associated with his amazon account
export const checkVendors = () =>
  uploadStep(async (dispatch, getState) => {
    if (!getState().account?.amazon?.vendors?.length) {
      // get vendors and check again
      dispatch(updateAlexaStage(ALEXA_STAGES.CHECKING_VENDOR));
      await dispatch(getVendors());

      // STEP 2.5: if no vendors again then send to developer account screen
      if (!getState().account?.amazon?.vendors?.length) {
        dispatch(updateAlexaStage(ALEXA_STAGES.NO_VENDOR));
        return;
      }
    }

    dispatch(checkInvName());
  });

// STEP 1 - check that user is logged in with valid amazon account
export const AmazonLogin = () =>
  uploadStep((dispatch, getState) => {
    if (!getState().account.amazon) return dispatch(updateAlexaStage(ALEXA_STAGES.AMAZON_LOGIN));
    dispatch(checkVendors());
  });

// start the publishing process and set option parameters
export const publish = (options = {}) => (dispatch, getState) => {
  const { stage } = publishStateSelector(getState());

  // if there is already an ongoing upload
  if (!ALEXA_STATES[stage].end) return;

  // set a unique publishing id with each publish
  dispatch(updateAlexa({ options, id: randomstring.generate() }));
  dispatch(AmazonLogin());
};

export const updateVendor = (vendorId) => async (dispatch, getState) => {
  const state = getState();
  const projectID = activeProjectIDSelector(state);

  const amznID = (await client.project.updateVendorId(projectID, vendorId)) || null;
  dispatch(updatePublishInfo({ amznID, vendorId }));
};
