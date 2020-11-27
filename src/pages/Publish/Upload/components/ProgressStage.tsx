import React from 'react';

import Box from '@/components/Box';
import Progress from '@/components/Progress';
import { BlockText } from '@/components/Text';
import { FeatureFlag } from '@/config/features';
import { css, styled, transition } from '@/hocs';
import { useFeature } from '@/hooks';

import StageContainer from './StageContainer';

export type ProgressStageProps = {
  progress: number;
};

const ProgressBar = styled.div<ProgressStageProps>`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 1000;
  ${({ progress }) =>
    progress >= 0
      ? css`
          height: 2px;
          width: ${progress}% !important;
          ${transition()};
        `
      : css`
          width: 0%;
          height: 0px;
          display: none;
        `}
  background-color: #5d9df5;
`;

const ProgressStage: React.FC<ProgressStageProps> = ({ children, progress }) => {
  const headerRedesign = useFeature(FeatureFlag.HEADER_REDESIGN);

  return headerRedesign.isEnabled ? (
    <ProgressBar progress={progress} />
  ) : (
    <StageContainer>
      <Box mt={8}>
        <Progress type="circle" strokeWidth={5} theme={{ default: { color: '#42a5ff' } }} percent={progress} />
      </Box>
      {children && (
        <BlockText textAlign="center" mt={16} mb={8}>
          {children}
        </BlockText>
      )}
    </StageContainer>
  );
};

export default ProgressStage;
