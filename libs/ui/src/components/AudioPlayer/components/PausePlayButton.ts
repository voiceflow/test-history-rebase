import type { WhiteButtonProps } from '@ui/components/Button';
import Button from '@ui/components/Button';
import { css, styled } from '@ui/styles';

const PausePlayButton = styled(Button).attrs({ variant: Button.Variant.WHITE, rounded: true })<WhiteButtonProps>`
  z-index: 1;
  width: 42px;
  height: 42px;
  margin-right: 24px;

  ${({ icon }) =>
    icon === 'play' &&
    css`
      svg {
        position: relative;
        left: 1px;
      }
    `}
`;

export default PausePlayButton;
