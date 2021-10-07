import _isString from 'lodash/isString';
import React from 'react';

import { DialogflowPublishJobErrorType } from '@/constants/platforms';
import { DialogflowExportJob, DialogflowPublishJob, JobStageData } from '@/models';

import { ErrorStage as BaseErrorStage } from '../components';

const getTitle = ({ errorType, message }: JobStageData<DialogflowExportJob.ErrorStage> | JobStageData<DialogflowPublishJob.ErrorStage>) => {
  switch (errorType) {
    case DialogflowPublishJobErrorType.SUBMITTING_FOR_REVIEW:
      return 'Google Error Response';
    case DialogflowPublishJobErrorType.RENDERING:
      return 'Rendering Error';
    case DialogflowPublishJobErrorType.SUBMITTING_PROJECT:
      return 'Submitting Project Error';
    default:
      return message;
  }
};

const getError = ({ errorType, error }: JobStageData<DialogflowExportJob.ErrorStage> | JobStageData<DialogflowPublishJob.ErrorStage>) => {
  if (errorType === DialogflowPublishJobErrorType.RENDERING) {
    return 'project structure unable to build, please contact us on Intercom';
  }

  const strError = _isString(error) ? error : error?.message;

  return _isString(strError) ? strError : 'something went wrong, please contact us on Intercom';
};

interface ErrorStageProps {
  stage: DialogflowExportJob.ErrorStage | DialogflowPublishJob.ErrorStage;
}

const ErrorStage: React.FC<ErrorStageProps> = ({ stage }) => (
  <BaseErrorStage title={getTitle(stage.data)}>
    <span>{getError(stage.data)}</span>
  </BaseErrorStage>
);

export default ErrorStage;
