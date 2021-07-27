import { PlatformType } from '@voiceflow/internal';
import { FlexCenter } from '@voiceflow/ui';

import { styled } from '@/hocs';
import { getPlatformValue } from '@/utils/platform';

interface ContentContainerProps {
  width?: number;
  platform: PlatformType;
}

const GENERAL_MENU_PADDING = 65;
const ALEXA_MENU_PADDING = 234;

const ContentContainer = styled(FlexCenter)<ContentContainerProps>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  padding-left: ${({ platform }) => getPlatformValue(platform, { [PlatformType.ALEXA]: ALEXA_MENU_PADDING }, 0) + GENERAL_MENU_PADDING}px;
  padding-right: ${({ theme }) => theme.components.prototypeSidebar.width}px;
  width: ${({ width }) => width}px;
  transform: translate(-50%);
`;

export default ContentContainer;
