import { BoxFlexStart } from '@voiceflow/ui';

import { css, styled } from '@/hocs';

export const Container = styled(BoxFlexStart)<{ height: number }>`
  max-width: 295px;
  z-index: 2;

  ${({ height }) => css`
    max-height: ${height}px;
  `}
  width: 100%;
  & > * {
    width: 100%;
  }
`;
