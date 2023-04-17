import { FlexCenter } from '@voiceflow/ui';

import { css, styled, transition } from '@/hocs/styled';

interface SpeakerWrapperProps {
  isPlaying?: boolean;
}

const SpeakerWrapper = styled(FlexCenter)<SpeakerWrapperProps>`
  width: 32px;
  min-width: 32px;
  height: 32px;
  cursor: pointer;
  color: #6e849a;
  opacity: 0.8;
  ${transition('opacity')}

  &:hover {
    opacity: 1;
  }

  ${({ isPlaying }) =>
    isPlaying &&
    css`
      opacity: 1;
    `}
`;

export default SpeakerWrapper;
