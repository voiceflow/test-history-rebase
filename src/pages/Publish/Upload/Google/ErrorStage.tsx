import _isString from 'lodash/isString';
import React from 'react';

import { GooglePublishJobErrorType } from '@/constants/platforms';
import { GoogleExportJob, GooglePublishJob, JobStageData } from '@/models';

import { ErrorStage as BaseErrorStage } from '../components';

const getTitle = ({ errorType, message }: JobStageData<GoogleExportJob.ErrorStage> | JobStageData<GooglePublishJob.ErrorStage>) => {
  switch (errorType) {
    case GooglePublishJobErrorType.SUBMITTING_FOR_REVIEW:
      return 'Google Error Response';
    case GooglePublishJobErrorType.RENDERING:
      return 'Rendering Error';
    case GooglePublishJobErrorType.SUBMITTING_PROJECT:
      return 'Submitting Project Error';
    default:
      return message;
  }
};

const getError = ({ errorType, error }: JobStageData<GoogleExportJob.ErrorStage> | JobStageData<GooglePublishJob.ErrorStage>) => {
  if (errorType === GooglePublishJobErrorType.RENDERING) {
    return 'project structure unable to build, please contact us on Intercom';
  }

  const strError = _isString(error) ? error : error?.message;

  return _isString(strError) ? strError : 'something went wrong, please contact us on Intercom';
};

const getFooter = ({ googleError }: JobStageData<GoogleExportJob.ErrorStage> | JobStageData<GooglePublishJob.ErrorStage>) => {
  if (googleError) {
    return (
      <>
        Google responded with an error, Visit our{' '}
        <u>
          <a href="https://www.facebook.com/groups/voiceflowgroup">community</a>
        </u>{' '}
        or contact us on Intercom
      </>
    );
  }

  return null;
};

type ErrorStageProps = {
  stage: GoogleExportJob.ErrorStage | GooglePublishJob.ErrorStage;
};

const ErrorStage: React.FC<ErrorStageProps> = ({ stage }) => (
  <BaseErrorStage title={getTitle(stage.data)} footer={getFooter(stage.data)}>
    {getError(stage.data)}
  </BaseErrorStage>
);

export default ErrorStage;
