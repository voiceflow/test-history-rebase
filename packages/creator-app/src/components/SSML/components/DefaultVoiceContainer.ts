import { FlexCenter } from '@voiceflow/ui';

import { css, styled, transition } from '@/hocs/styled';

interface DefaultVoiceContainerProps {
  active?: boolean;
}

const DefaultVoiceContainer = styled(FlexCenter)<DefaultVoiceContainerProps>`
  ${transition('opacity')}
  position: absolute;
  top: 0;
  right: 24px;
  bottom: 0;

  opacity: 0;

  svg {
    ${transition('color')}

    color: #becedc;

    &:hover {
      color: #6e849a;
    }
  }

  ${({ active }) =>
    active &&
    css`
      opacity: 1 !important;

      svg {
        color: #e5b813 !important;
      }
    `}
`;

export default DefaultVoiceContainer;
