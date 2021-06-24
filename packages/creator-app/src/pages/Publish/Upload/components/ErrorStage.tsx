import { Box } from '@voiceflow/ui';
import React from 'react';

import { Nullable } from '@/types';

import StageContainer from './StageContainer';
import StageHeader from './StageHeader';

export type ErrorStageProps = {
  title: string;
  footer?: Nullable<React.ReactNode>;
};

const ErrorStage: React.FC<ErrorStageProps> = ({ title, children }) => (
  <StageContainer style={{ textAlign: 'left' }}>
    <StageHeader color="#e91e63">{title}</StageHeader>

    <Box mt={12}>{children}</Box>
  </StageContainer>
);

export default ErrorStage;
