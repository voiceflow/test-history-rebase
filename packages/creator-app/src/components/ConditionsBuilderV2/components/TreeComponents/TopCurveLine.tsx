import { Box } from '@voiceflow/ui';
import React from 'react';

import { css, styled } from '@/hocs';

interface LineProps {
  active?: boolean;
}

const activeBorderColor = (active: boolean | undefined) =>
  active &&
  css`
    border-color: rgba(61, 130, 226, 0.3);
  `;

const TopCurve = styled.div<LineProps>`
  border-left: 2px solid rgba(212, 217, 230, 0.65);
  border-top: 2px solid rgba(212, 217, 230, 0.65);
  border-radius: 50px 0 0 0;
  height: 13px;
  width: 13px;

  ${({ active }) => activeBorderColor(active)}
`;

export const BoxLine = styled.div<LineProps>`
  border: solid 1px rgba(212, 217, 230, 0.65);
  border-radius: 8px;
  border-radius: 0 50px 50px 0;
  height: 0px;
  width: 0px;

  ${({ active }) => activeBorderColor(active)}
`;

const TopCurveLine: React.FC<LineProps> = ({ active = false }) => {
  return (
    <Box.FlexAlignStart>
      <TopCurve active={active} />
      <BoxLine active={active} />
    </Box.FlexAlignStart>
  );
};

export default TopCurveLine;
