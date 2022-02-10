import { FlexCenter } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { styled } from '@/hocs';
import { getPlatformValue } from '@/utils/platform';

interface ContentContainerProps {
  width?: number;
  platform: VoiceflowConstants.PlatformType;
}

const GENERAL_MENU_PADDING = 65;
const ALEXA_MENU_PADDING = 234;

const ContentContainer = styled(FlexCenter)<ContentContainerProps>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  padding-left: ${({ platform }) =>
    getPlatformValue(platform, { [VoiceflowConstants.PlatformType.ALEXA]: ALEXA_MENU_PADDING }, 0) + GENERAL_MENU_PADDING}px;
  padding-right: ${({ theme }) => theme.components.prototypeSidebar.width}px;
  width: ${({ width }) => width}px;
  transform: translate(-50%);
`;

export default ContentContainer;
