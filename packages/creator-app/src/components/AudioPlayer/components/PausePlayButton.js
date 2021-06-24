import { IconButton } from '@voiceflow/ui';

import { css, styled } from '@/hocs';

const PausePlayButton = styled(IconButton)`
  z-index: 1;
  flex-shrink: 0;
  margin-right: 24px;

  ${({ icon }) =>
    icon === 'play' &&
    css`
      svg {
        position: relative;
        top: 1px;
        left: 2px;
      }
    `}
`;

export default PausePlayButton;
