import _isString from 'lodash/isString';
import React from 'react';

import { AlexaJobErrorType } from '@/constants/platforms';
import { AlexaJob, Job } from '@/models';
import { PublishContext } from '@/pages/Skill/contexts';

import { ErrorStage as BaseErrorStage } from '../shared';

export type ErrorStageProps = {
  title: string;
};

const getTitle = (errorType: AlexaJobErrorType, message: string) => {
  switch (errorType) {
    case AlexaJobErrorType.SUBMITTING_FOR_REVIEW:
      return 'Amazon Error Response';
    case AlexaJobErrorType.RENDERING:
      return 'Rendering Error';
    default:
      return message;
  }
};

const getError = (errorType: AlexaJobErrorType, error?: unknown) => {
  if (errorType === AlexaJobErrorType.RENDERING) {
    return 'project structure unable to build, please contact us on Intercom';
  }

  return _isString(error) ? error : 'something went wrong, please contact us on Intercom';
};

const getFooter = (errorType: AlexaJobErrorType) => {
  if (errorType === AlexaJobErrorType.SUBMITTING_FOR_REVIEW) {
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

const ErrorStage: React.FC = () => {
  const { stage } = React.useContext(PublishContext)!.job! as Job<AlexaJob.ErrorStage>;

  return (
    <BaseErrorStage title={getTitle(stage.data.errorType, stage.data.message)} footer={getFooter(stage.data.errorType)}>
      {getError(stage.data.errorType, stage.data.error)}
    </BaseErrorStage>
  );
};

export default ErrorStage;
