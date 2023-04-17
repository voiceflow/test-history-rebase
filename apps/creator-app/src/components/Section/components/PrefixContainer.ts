import { css, styled, units } from '@/hocs/styled';

const PrefixContainer = styled.div<{ overflowHidden?: boolean }>`
  ${({ overflowHidden }) =>
    overflowHidden &&
    css`
      overflow-x: hidden;
    `}

  &:not(:last-child) {
    margin-right: ${units(2)}px;
  }
`;

export default PrefixContainer;
