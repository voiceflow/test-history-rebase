import _isString from 'lodash/isString';
import React from 'react';

import { AlexaPublishJobErrorType } from '@/constants/platforms';
import { AlexaExportJob, AlexaPublishJob, JobStageData } from '@/models';

import { ErrorStage as BaseErrorStage } from '../shared';

const getTitle = ({ errorType, message }: JobStageData<AlexaExportJob.ErrorStage> | JobStageData<AlexaPublishJob.ErrorStage>) => {
  switch (errorType) {
    case AlexaPublishJobErrorType.SUBMITTING_FOR_REVIEW:
      return 'Amazon Error Response';
    case AlexaPublishJobErrorType.RENDERING:
      return 'Rendering Error';
    case AlexaPublishJobErrorType.SUBMITTING_PROJECT:
      return 'Submitting Project Error';
    default:
      return message;
  }
};

const getError = ({ errorType, error }: JobStageData<AlexaExportJob.ErrorStage> | JobStageData<AlexaPublishJob.ErrorStage>) => {
  if (errorType === AlexaPublishJobErrorType.RENDERING) {
    return 'project structure unable to build, please contact us on Intercom';
  }

  const strError = _isString(error) ? error : error?.message;

  return _isString(strError) ? strError : 'something went wrong, please contact us on Intercom';
};

const getFooter = ({ amazonError }: JobStageData<AlexaExportJob.ErrorStage> | JobStageData<AlexaPublishJob.ErrorStage>) => {
  if (amazonError) {
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
  <BaseErrorStage title={getTitle(stage.data)} footer={getFooter(stage.data)}>
    {getError(stage.data)}
  </BaseErrorStage>
);

export default ErrorStage;
