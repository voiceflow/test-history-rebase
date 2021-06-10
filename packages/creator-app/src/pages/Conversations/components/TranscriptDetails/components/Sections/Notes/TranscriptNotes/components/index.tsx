import { FlexStart } from '@/components/Box';
import { css, styled } from '@/hocs';

export const Container = styled(FlexStart)<{ height: number }>`
  max-width: 295px;

  ${({ height }) => css`
    max-height: ${height}px;
  `}
  width: 100%;
  & > * {
    width: 100%;
  }
`;
