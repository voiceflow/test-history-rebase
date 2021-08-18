import _isString from 'lodash/isString';
import React from 'react';

import { GeneralJobErrorType } from '@/constants/platforms';
import { GeneralJob, JobStageData } from '@/models';

import { ErrorStage as BaseErrorStage } from '../components';

const getTitle = ({ errorType, message }: JobStageData<GeneralJob.ErrorStage>) => {
  if (errorType) {
    return 'Rendering Error';
  }

  return message;
};

const getError = ({ errorType, error }: JobStageData<GeneralJob.ErrorStage>) => {
  if (errorType === GeneralJobErrorType.RENDERING) {
    return 'project structure unable to build, please contact us on Intercom';
  }

  const strError = _isString(error) ? error : error?.message;

  return _isString(strError) ? strError : 'something went wrong, please contact us on Intercom';
};

interface ErrorStageProps {
  stage: GeneralJob.ErrorStage;
}

const ErrorStage: React.FC<ErrorStageProps> = ({ stage }) => (
  <BaseErrorStage title={getTitle(stage.data)}>
    <span>{getError(stage.data)}</span>
  </BaseErrorStage>
);

export default ErrorStage;
