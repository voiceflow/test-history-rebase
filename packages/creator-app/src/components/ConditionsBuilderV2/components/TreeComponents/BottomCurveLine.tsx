import { Box } from '@voiceflow/ui';
import React from 'react';

import { css, styled } from '@/hocs';

import { BoxLine } from './TopCurveLine';

interface LineProps {
  active?: boolean;
}

const BottomCurve = styled.div<LineProps>`
  border-left: 2px solid rgba(212, 217, 230, 0.65);
  border-bottom: 2px solid rgba(212, 217, 230, 0.65);
  border-radius: 0 0 0 50px;
  height: 13px;
  width: 13px;

  ${({ active }) =>
    active &&
    css`
      border-color: rgba(61, 130, 226, 0.3);
    `}
`;

const BottomCurveLine: React.FC<LineProps> = ({ active = false }) => {
  return (
    <Box.FlexAlignEnd>
      <BottomCurve active={active} />
      <BoxLine active={active} />
    </Box.FlexAlignEnd>
  );
};

export default BottomCurveLine;
