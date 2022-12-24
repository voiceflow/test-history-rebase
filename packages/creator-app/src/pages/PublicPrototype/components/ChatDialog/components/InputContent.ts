import { BoxFlex } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

export const DESKTOP_INPUT_CONTAINER_HEIGHT = 80;
export const MOBILE_INPUT_CONTAINER_HEIGHT = 60;

const InputContent = styled(BoxFlex)<{ isMobile?: boolean }>`
  flex: 2;
  height: 100%;
  max-width: 100%;
  font-size: ${({ isMobile }) => (isMobile ? 16 : 15)}px;
  margin-top: -16px;
  margin-bottom: -16px;

  input {
    height: 100%;

    ::placeholder {
      color: ${({ theme }) => theme.colors.secondary} !important;
    }
  }
`;

export default InputContent;
