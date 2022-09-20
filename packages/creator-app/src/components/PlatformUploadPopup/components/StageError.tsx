import { Box } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import _isString from 'lodash/isString';
import React from 'react';

import {
  AnyErrorStage,
  AnyErrorStageData,
  getPlatformName,
  IsPublishJobRenderingError,
  isPublishJobSubmittingProjectError,
  isPublishJobSubmittingReviewError,
} from '@/constants/platforms';
import * as ProjectV2 from '@/ducks/projectV2';
import { useSelector } from '@/hooks';

import StageContainer from './StageContainer';
import StageHeader from './StageHeader';

const getTitle = ({ errorType, message }: AnyErrorStageData, platform: VoiceflowConstants.PlatformType) => {
  if (IsPublishJobRenderingError(errorType)) {
    return 'Rendering error';
  }

  if (isPublishJobSubmittingProjectError(errorType)) {
    return 'Submitting project error';
  }

  if (isPublishJobSubmittingReviewError(errorType)) {
    return `${getPlatformName(platform)} error response`;
  }

  return message;
};

const getError = <E extends AnyErrorStageData>(
  stageError: E,
  defaultMessage: string,
  errorMap?: (statusCode: E) => React.ReactElement | string | null
) => {
  const { errorType, error } = stageError;

  if (IsPublishJobRenderingError(errorType)) {
    return 'Project structure unable to build, please contact us on Intercom';
  }

  if (errorMap) {
    const msg = errorMap(stageError);
    if (msg) return msg;
  }

  const strError = _isString(error) ? error : error?.message;

  return _isString(strError) ? strError : defaultMessage;
};

interface ErrorStageProps<S extends AnyErrorStage> {
  stage: S;
  errorMap?: (statusCode: S['data']) => React.ReactElement | string | null;
  defaultMessage?: string;
}

const ErrorStage = <S extends AnyErrorStage = AnyErrorStage>({
  stage,
  errorMap,
  defaultMessage = 'Something went wrong, please contact us on Intercom',
}: ErrorStageProps<S>) => {
  const platform = useSelector(ProjectV2.active.platformSelector);

  return (
    <StageContainer style={{ textAlign: 'left' }} width={300}>
      <StageHeader color="#e91e63">{getTitle(stage.data, platform)}</StageHeader>
      <Box mt={12}>
        <span>{getError(stage.data, defaultMessage, errorMap)}</span>
      </Box>
    </StageContainer>
  );
};

export default ErrorStage;
