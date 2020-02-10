import { css } from 'styled-components';

import IconButton from '@/components/IconButton';
import { styled } from '@/hocs';

const PausePlayButton = styled(IconButton)`
  margin-right: 24px;
  flex-shrink: 0;
  z-index: 1;

  ${({ icon }) =>
    icon === 'play' &&
    css`
      svg {
        position: relative;
        left: 2px;
        top: 1px;
      }
    `}
`;

export default PausePlayButton;
