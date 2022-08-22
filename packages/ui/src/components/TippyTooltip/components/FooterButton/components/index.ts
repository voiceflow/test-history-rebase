import Button from '@ui/components/Button';
import { css, styled } from '@ui/styles';

export const ButtonContainer = styled(Button.DarkButton)<{ isVisible: boolean }>`
  opacity: 0;
  padding: 10px 0px;
  position: absolute;
  bottom: 6px;
  width: calc(100% - 10px);
  left: 5px;

  ${({ isVisible }) =>
    isVisible &&
    css`
      opacity: 1;
    `}
`;
