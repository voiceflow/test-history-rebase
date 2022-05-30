import IconButton from '@ui/components/IconButton';
import { css, styled } from '@ui/styles';

const PausePlayButton = styled(IconButton)`
  z-index: 1;
  flex-shrink: 0;
  margin-right: 24px;

  ${({ icon }) =>
    icon === 'play' &&
    css`
      svg {
        position: relative;
        left: 1px;
        transform: scale(1.2);
      }
    `}
`;

export default PausePlayButton;
