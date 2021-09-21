import { Constants } from '@voiceflow/general-types';
import { FlexCenter } from '@voiceflow/ui';

import { styled } from '@/hocs';
import { getPlatformValue } from '@/utils/platform';

interface ContentContainerProps {
  width?: number;
  platform: Constants.PlatformType;
}

const GENERAL_MENU_PADDING = 65;
const ALEXA_MENU_PADDING = 234;

const ContentContainer = styled(FlexCenter)<ContentContainerProps>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  padding-left: ${({ platform }) => getPlatformValue(platform, { [Constants.PlatformType.ALEXA]: ALEXA_MENU_PADDING }, 0) + GENERAL_MENU_PADDING}px;
  padding-right: ${({ theme }) => theme.components.prototypeSidebar.width}px;
  width: ${({ width }) => width}px;
  transform: translate(-50%);
`;

export default ContentContainer;
