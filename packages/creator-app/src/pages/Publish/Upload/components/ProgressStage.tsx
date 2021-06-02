import React from 'react';

import { css, styled, transition } from '@/hocs';

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

const ProgressStage: React.FC<ProgressStageProps> = ({ progress }) => <ProgressBar progress={progress} />;

export default ProgressStage;
