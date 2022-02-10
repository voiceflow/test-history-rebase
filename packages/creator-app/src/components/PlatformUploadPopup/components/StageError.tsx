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
    return 'Rendering Error';
  }

  if (isPublishJobSubmittingProjectError(errorType)) {
    return 'Submitting Project Error';
  }

  if (isPublishJobSubmittingReviewError(errorType)) {
    return `${getPlatformName(platform)} Error Response`;
  }

  return message;
};

const getError = ({ errorType, error }: AnyErrorStageData) => {
  if (IsPublishJobRenderingError(errorType)) {
    return 'project structure unable to build, please contact us on Intercom';
  }

  const strError = _isString(error) ? error : error?.message;

  return _isString(strError) ? strError : 'something went wrong, please contact us on Intercom';
};

interface ErrorStageProps {
  stage: AnyErrorStage;
}

const ErrorStage: React.FC<ErrorStageProps> = ({ stage }) => {
  const platform = useSelector(ProjectV2.active.platformSelector);

  return (
    <StageContainer style={{ textAlign: 'left' }}>
      <StageHeader color="#e91e63">{getTitle(stage.data, platform)}</StageHeader>

      <Box mt={12}>
        <span>{getError(stage.data)}</span>
      </Box>
    </StageContainer>
  );
};

export default ErrorStage;
