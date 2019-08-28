/* eslint-disable import/prefer-default-export */

// the publish id changes midway through an async step do not allow any further dispatches
export const createUploadStep = (platform) => (callback) => (dispatch, getState) => {
  const publishId = getState().publish[platform].id;

  const overrideDispatch = (step) => {
    // only update if id is consistent
    if (getState().publish[platform].id === publishId) {
      dispatch(step);
    }
  };

  return callback(overrideDispatch, getState);
};
