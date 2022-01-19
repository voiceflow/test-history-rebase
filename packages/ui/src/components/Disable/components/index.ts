import { css, styled, transition } from '@ui/styles';

// eslint-disable-next-line import/prefer-default-export
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
