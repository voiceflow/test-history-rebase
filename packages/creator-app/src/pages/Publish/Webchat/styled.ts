import { Chat } from '@voiceflow/react-chat';
import { Box } from '@voiceflow/ui';

import { styled } from '@/hocs';

import Section from './sections/components/Section';

export const PreviewContainer = styled(Box.FlexCenter)`
  border-left: 1px solid #dfe3ed;
  background: linear-gradient(180deg, #eef4f6 85%, #eef4f6 100%);
  padding: 0 32px;

  height: 100%;
  max-width: 840px;

  & label {
    margin-bottom: 0;
  }

  ${Chat.Container.toString()} {
    height: 100%;
  }

  @media (max-width: 1300px) {
    display: none;
  }

  @media (min-width: 1600px) {
    width: 600px;
  }
`;

export const SettingsContainer = styled(Box.Flex)`
  flex-direction: column;
  padding: 24px 32px;
  height: 100%;
  overflow-y: scroll;
  min-width: 600px;
  flex-grow: 1;

  & ${Section.Container} {
    margin-bottom: 16px;
  }
`;
