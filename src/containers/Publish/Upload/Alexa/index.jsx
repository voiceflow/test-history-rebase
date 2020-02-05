import React from 'react';
import { connect } from 'react-redux';

import { ALEXA_STAGES, ALEXA_STATES } from '@/ducks/publish/alexa';

import { IndefiniteLoading, ProgressLoading } from '../common/Loading';
import RenderingError from '../common/RenderingError';
import AmazonError from './AmazonError';
import GetAmazonLogin from './AmazonLogin';
import InvalidInvName from './InvalidInvName';
import NoVendors from './NoVendors';
import SubmitSuccess from './SubmitSuccess';
import UploadSuccess from './UploadSuccess';

export const UploadAlexa = (props) => {
  const {
    publish: { stage },
  } = props;

  switch (stage) {
    case ALEXA_STAGES.AMAZON_LOGIN:
      return <GetAmazonLogin />;
    case ALEXA_STAGES.CHECKING_VENDOR:
      return <IndefiniteLoading message="Checking Vendors" />;
    case ALEXA_STAGES.NO_VENDOR:
      return <NoVendors />;
    case ALEXA_STAGES.INVALID_INV_NAME:
      return <InvalidInvName />;
    case ALEXA_STAGES.RENDERING_ERROR:
      return <RenderingError />;
    case ALEXA_STAGES.RENDERING:
    case ALEXA_STAGES.UPLOADING_ALEXA:
    case ALEXA_STAGES.CHOICE_MODEL:
    case ALEXA_STAGES.ENABLING_SKILL:
    case ALEXA_STAGES.SUBMITTING_SKILL:
      return <ProgressLoading state={ALEXA_STATES[stage]} />;
    case ALEXA_STAGES.ALEXA_ERROR:
      return <AmazonError />;
    case ALEXA_STAGES.UPLOAD_SUCCESS:
      return <UploadSuccess />;
    case ALEXA_STAGES.SUBMIT_SUCCESS:
      return <SubmitSuccess />;
    default:
      return null;
  }
};

const mapStateToProps = (state) => ({
  publish: state.publish.alexa,
});

export default connect(mapStateToProps)(UploadAlexa);
