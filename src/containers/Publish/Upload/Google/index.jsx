import React from 'react';
import { connect } from 'react-redux';

import { GOOGLE_STAGES, GOOGLE_STATES } from '@/ducks/publish/google';

import { ProgressLoading } from '../common/Loading';
import RenderingError from '../common/RenderingError';
import GoogleError from './GoogleError';
import GetGoogleLogin from './GoogleLogin';
import NoDialogFlow from './NoDialogFlow';
import UploadSuccess from './UploadSuccess';

export const UploadGoogle = (props) => {
  const {
    publish: { stage },
  } = props;

  switch (stage) {
    case GOOGLE_STAGES.GOOGLE_LOGIN:
      return <GetGoogleLogin />;
    case GOOGLE_STAGES.NO_DIALOGFLOW:
      return <NoDialogFlow />;
    case GOOGLE_STAGES.RENDERING_ERROR:
      return <RenderingError />;
    case GOOGLE_STAGES.RENDERING:
    case GOOGLE_STAGES.UPLOADING_GOOGLE:
      return <ProgressLoading state={GOOGLE_STATES[stage]} />;
    case GOOGLE_STAGES.GOOGLE_ERROR:
      return <GoogleError />;
    case GOOGLE_STAGES.UPLOAD_SUCCESS:
      return <UploadSuccess />;
    default:
      return null;
  }
};

const mapStateToProps = (state) => ({
  publish: state.publish.google,
});

export default connect(mapStateToProps)(UploadGoogle);
