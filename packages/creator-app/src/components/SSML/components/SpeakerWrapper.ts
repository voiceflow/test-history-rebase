import { FlexCenter } from '@voiceflow/ui';

import { css, styled, transition } from '@/hocs';

interface SpeakerWrapperProps {
  isPlaying?: boolean;
}

const SpeakerWrapper = styled(FlexCenter)<SpeakerWrapperProps>`
  width: 20px;
  height: 24px;
  padding: 4px 0 4px 4px;
  margin-left: -4px;
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
