import * as Platform from '@voiceflow/platform-config';
import { Box } from '@voiceflow/ui';
// eslint-disable-next-line you-dont-need-lodash-underscore/is-string
import _isString from 'lodash/isString';
import React from 'react';

import {
  AnyErrorStage,
  AnyErrorStageData,
  IsPublishJobRenderingError,
  isPublishJobSubmittingProjectError,
  isPublishJobSubmittingReviewError,
} from '@/constants/platforms';
import * as ProjectV2 from '@/ducks/projectV2';
import { useSelector } from '@/hooks';

import StageContainer from './StageContainer';
import StageHeader from './StageHeader';

const getTitle = ({ errorType, message }: AnyErrorStageData, platform: Platform.Constants.PlatformType) => {
  if (IsPublishJobRenderingError(errorType)) {
    return 'Rendering error';
  }

  if (isPublishJobSubmittingProjectError(errorType)) {
    return 'Submitting agent error';
  }

  if (isPublishJobSubmittingReviewError(errorType)) {
    return `${Platform.Config.get(platform).name} error response`;
  }

  return message;
};

const getError = <E extends AnyErrorStageData>(stageError: E, defaultMessage: string) => {
  const { errorType, error } = stageError;

  if (IsPublishJobRenderingError(errorType)) {
    return 'Agent structure unable to build, please wait a while and try again. If the issue persists, then please contact us';
  }

  const strError = _isString(error) ? error : error?.message;

  return _isString(strError) ? strError : defaultMessage;
};

interface ErrorStageProps<S extends AnyErrorStage> {
  stage: S;
  defaultMessage?: string;
}

const ErrorStage = <S extends AnyErrorStage = AnyErrorStage>({
  stage,
  defaultMessage = 'Something went wrong, please wait a while and try again. If the issue persists, then please contact us',
}: ErrorStageProps<S>) => {
  const platform = useSelector(ProjectV2.active.platformSelector);

  return (
    <StageContainer style={{ textAlign: 'left' }} width={300}>
      <StageHeader color="#BD425F">{getTitle(stage.data, platform)}</StageHeader>
      <Box mt={12} style={{ wordBreak: 'break-word' }}>
        <span>{getError(stage.data, defaultMessage)}</span>
      </Box>
    </StageContainer>
  );
};

export default ErrorStage;
