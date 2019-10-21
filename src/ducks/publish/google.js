import axios from 'axios';
import _ from 'lodash';
import randomstring from 'randomstring';

import { PlatformType } from '@/constants';
import { activeProjectIDSelector, publishPlatformSelectors, updatePublishPlatforms } from '@/ducks/skill';

import { createPublishStateSelector, createUploadStep } from './utils';

export const PLATFORM = PlatformType.GOOGLE;

export const publishInfoSelector = publishPlatformSelectors[PLATFORM];
export const updatePublishInfo = updatePublishPlatforms[PLATFORM];

export const GOOGLE_STATES = {
  IDLE: {
    end: true,
  },
  GOOGLE_LOGIN: {
    description: 'Google Login',
    end: true,
  },
  NO_DIALOGFLOW: {
    description: 'Dialogflow Credentials',
    end: true,
  },
  RENDERING_ERROR: {
    end: true,
  },
  CHECK_DIALOGFLOW: {},
  RENDERING: {
    loading: {
      label: 'Rendering Flows',
      start: 0,
      end: 9,
      time: 1500,
    },
  },
  UPLOADING_GOOGLE: {
    loading: {
      label: 'Uploading to Google',
      start: 10,
      end: 98,
      time: 20000,
    },
  },
  GOOGLE_ERROR: {
    end: true,
  },
  UPLOAD_SUCCESS: {
    end: true,
  },
};

export const GOOGLE_STAGES = Object.keys(GOOGLE_STATES).reduce((stages, name) => {
  stages[name] = name;
  return stages;
}, {});

export const UPDATE_GOOGLE = 'publish/google/UPDATE';
export const UPDATE_GOOGLE_STAGE = 'publish/google/stage/UPDATE';
export const UPDATE_GOOGLE_ERROR = 'publish/google/error/UPDATE';

const initialState = {
  stage: GOOGLE_STAGES.IDLE,
  error: null,
  id: null,
  credentials: false,
};

export default function googleReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_GOOGLE:
      return {
        ...state,
        ...action.payload,
      };
    case UPDATE_GOOGLE_STAGE:
      if (action.payload in GOOGLE_STATES) {
        return {
          ...state,
          stage: action.payload,
        };
      }
      return state;
    case UPDATE_GOOGLE_ERROR:
      return {
        ...state,
        stage: GOOGLE_STAGES.GOOGLE_ERROR,
        error: action.payload,
      };
    default:
      return state;
  }
}

export const updateGoogle = (state) => ({
  type: UPDATE_GOOGLE,
  payload: state,
});

export const updateGoogleStage = (stage) => ({
  type: UPDATE_GOOGLE_STAGE,
  payload: stage,
});

export const updateGoogleError = (error) => ({
  type: UPDATE_GOOGLE_ERROR,
  payload: error,
});

export const resetGoogleUpload = () => (dispatch) => {
  dispatch(updateGoogle(initialState));
};

export const publishStateSelector = createPublishStateSelector(PLATFORM);
const uploadStep = createUploadStep(PLATFORM);

export const resetDialogflowCredential = () => async (dispatch, getState) => {
  const projectID = activeProjectIDSelector(getState());

  await axios.delete('/session/google/dialogflow_access_token', {
    data: {
      project_id: projectID,
    },
  });
  dispatch(updatePublishInfo({ googleID: null }));
  dispatch(updateGoogle({ credentials: false, error: null }));
};

// UPLOAD SUCCESS
export const uploadSuccess = () =>
  uploadStep(async (dispatch) => {
    dispatch(updateGoogleStage(GOOGLE_STAGES.UPLOAD_SUCCESS));
  });

// STEP 4
export const submitProject = (newVersionId) =>
  uploadStep(async (dispatch, getState) => {
    const projectID = activeProjectIDSelector(getState());
    dispatch(updateGoogleStage(GOOGLE_STAGES.UPLOADING_GOOGLE));
    try {
      await axios.post(`/project/${projectID}/version/${newVersionId}/google`);
      dispatch(uploadSuccess());
    } catch (err) {
      const error_msg = _.get(err, ['response', 'data', 'message']) || err;
      dispatch(updateGoogleError(error_msg));
    }
  });

// STEP 3
export const renderProject = () =>
  uploadStep(async (dispatch, getState) => {
    const state = getState();
    const projectID = activeProjectIDSelector(state);
    const { googleID } = publishStateSelector(state);

    dispatch(updateGoogleStage(GOOGLE_STAGES.RENDERING));
    try {
      if (window.canvasSave) await window.canvasSave();
      const { data } = await axios.post(`/project/${projectID}/render`, { platform: 'google', google_id: googleID });
      const newVersionId = data.new_skill.skill_id;
      dispatch(submitProject(newVersionId));
    } catch (err) {
      console.error(err);
      dispatch(updateGoogleStage(GOOGLE_STAGES.RENDERING_ERROR));
    }
  });

// STEP 2.2 Link Dialogflow Cred
export const linkDialogflowCredential = (token) =>
  uploadStep(async (dispatch, getState) => {
    const projectID = activeProjectIDSelector(getState());
    try {
      const { data } = await axios.post('/session/google/verify_dialogflow_token', {
        token,
        project_id: projectID,
      });
      dispatch(updatePublishInfo({ googleID: data.google_id }));
      dispatch(updateGoogle({ credentials: true, error: null }));
    } catch (err) {
      console.error(err);
      dispatch(updateGoogle({ error: err.response.data.data || err }));
    }
  });

// STEP 2.1 Load Dialogflow Cred
export const loadDialogflow = () =>
  uploadStep(async (dispatch, getState) => {
    const projectID = activeProjectIDSelector(getState());
    const {
      data: { token: checkToken },
    } = await axios.get(`/session/google/dialogflow_access_token/${projectID}`);
    if (!checkToken) {
      dispatch(updateGoogle({ credentials: false }));
    } else {
      dispatch(updatePublishInfo({ googleID: checkToken.google_id }));
      dispatch(updateGoogle({ credentials: true, error: checkToken.error }));
    }
    return checkToken;
  });

// STEP 2 - check that the project is linked to a dialogflow project
export const checkDialogflow = () =>
  uploadStep(async (dispatch, getState) => {
    const { options } = publishStateSelector(getState());

    // if options check is disabled, do not show this stage but still run
    if (options.check !== false) {
      dispatch(updateGoogleStage(GOOGLE_STAGES.CHECK_DIALOGFLOW));
    }

    const checkToken = await dispatch(loadDialogflow());
    if (!checkToken || checkToken.error) {
      return dispatch(updateGoogleStage(GOOGLE_STAGES.NO_DIALOGFLOW));
    }
    dispatch(renderProject());
  });

// STEP 1 - check that user is logged in with valid google account
export const GoogleLogin = () =>
  uploadStep((dispatch, getState) => {
    if (!getState().account.google) return dispatch(updateGoogleStage(GOOGLE_STAGES.GOOGLE_LOGIN));
    dispatch(checkDialogflow());
  });

// start the publishing process and set option parameters
export const publish = (options = {}) => (dispatch, getState) => {
  const state = getState();
  const { stage } = publishStateSelector(state);

  // if there is already an ongoing upload
  if (!GOOGLE_STATES[stage].end) return;

  // set a unique publishing id with each publish
  dispatch(updateGoogle({ options, id: randomstring.generate() }));
  dispatch(GoogleLogin());
};
