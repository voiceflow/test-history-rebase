import { Chat } from '@voiceflow/react-chat';
import { Box } from '@voiceflow/ui';

import { styled } from '@/hocs';

import { SectionContainer } from './sections';

export const PreviewContainer = styled(Box.FlexCenter)`
  border-left: 1px solid #dfe3ed;
  background: linear-gradient(180deg, #eef4f6 85%, #eef4f6 100%);

  flex-grow: 1;
  height: 100%;
  max-width: 840px;

  ${Chat.Container.toString()} {
    height: 100%;
  }
`;

export const SettingsContainer = styled(Box.Flex)`
  flex-direction: column;
  padding: 24px 32px;
  height: 100%;
  overflow-y: scroll;
  width: 650px;

  & ${SectionContainer} {
    margin-bottom: 16px;
  }
`;
