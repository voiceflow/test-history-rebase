import { css, styled, transition } from '@ui/styles';

export const DisableBox = styled.div<{ disabled: boolean }>`
  ${transition('opacity')};
  opacity: 1;

  ${({ disabled }) =>
    disabled &&
    css`
      pointer-events: none;
      opacity: 0.4;
      cursor: not-allowed;
    `}
`;
