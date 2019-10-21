import React from 'react';

import { styled } from '@/hocs';

import DiagramBlock from './DiagramBlock';

const LimitContainer = styled(DiagramBlock)`
  background: #fff !important;
`;

const FlowLimit = () => <LimitContainer>...</LimitContainer>;

export default FlowLimit;
