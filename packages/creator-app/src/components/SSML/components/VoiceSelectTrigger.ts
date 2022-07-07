import { Flex, SvgIcon } from '@voiceflow/ui';

import { css, styled } from '@/hocs';

const activeStyle = css`
  ${SvgIcon.Container} {
    opacity: 1;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const VoiceSelectTrigger = styled(Flex)<{ isActive?: boolean }>`
  gap: 8px;
  height: 32px;

  ${SvgIcon.Container} {
    color: #6e849a;
    opacity: 0.8;
  }

  &:hover {
    ${SvgIcon.Container} {
      opacity: 1;
    }
  }

  &:active {
    ${activeStyle}
  }

  ${({ isActive }) => isActive && activeStyle}
`;

export default VoiceSelectTrigger;
