import _isString from 'lodash/isString';
import React from 'react';

import { AlexaPublishJobErrorType } from '@/constants/platforms';
import { AlexaExportJob, AlexaPublishJob } from '@/models';

import { ErrorStage as BaseErrorStage } from '../shared';

const getTitle = (errorType: AlexaPublishJobErrorType, message: string) => {
  switch (errorType) {
    case AlexaPublishJobErrorType.SUBMITTING_FOR_REVIEW:
      return 'Amazon Error Response';
    case AlexaPublishJobErrorType.RENDERING:
      return 'Rendering Error';
    default:
      return message;
  }
};

const getError = (errorType: AlexaPublishJobErrorType, error?: unknown) => {
  if (errorType === AlexaPublishJobErrorType.RENDERING) {
    return 'project structure unable to build, please contact us on Intercom';
  }

  return _isString(error) ? error : 'something went wrong, please contact us on Intercom';
};

const getFooter = (errorType: AlexaPublishJobErrorType) => {
  if (errorType === AlexaPublishJobErrorType.SUBMITTING_FOR_REVIEW) {
    return (
      <>
        Amazon responded with an error, Visit our{' '}
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
  stage: AlexaExportJob.ErrorStage | AlexaPublishJob.ErrorStage;
};

const ErrorStage: React.FC<ErrorStageProps> = ({ stage }) => (
  <BaseErrorStage title={getTitle(stage.data.errorType, stage.data.message)} footer={getFooter(stage.data.errorType)}>
    {getError(stage.data.errorType, stage.data.error)}
  </BaseErrorStage>
);

export default ErrorStage;
