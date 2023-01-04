import { Flex, SvgIcon } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';

const activeStyle = css`
  ${SvgIcon.Container} {
    opacity: 1;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const VoiceSelectTrigger = styled(Flex)<{ isActive?: boolean }>`
  height: 32px;
  max-width: 250px;

  ${SvgIcon.Container} {
    color: #6e849a;
    opacity: 0.8;
    margin-left: 2px;
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
