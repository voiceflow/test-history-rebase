import { Chat } from '@voiceflow/react-chat';
import { Box } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

export const PreviewContainer = styled(Box.FlexCenter)`
  position: sticky;
  top: 0;
  border-left: 1px solid #dfe3ed;
  background: linear-gradient(180deg, #eef4f6 85%, #eef4f6 100%);
  padding: 0 32px;
  margin: -32px -32px -32px 0;

  flex: 1;
  height: calc(100vh - 61px);

  & label {
    margin-bottom: 0;
  }

  ${Chat.Container.toString()} {
    height: 100%;
  }

  @media (max-width: 1348px) {
    display: none;
  }
`;

export const SettingsContainer = styled(Box.Flex)`
  flex-direction: column;
  padding-right: 32px;
  min-width: 600px;
  width: 100%;
  max-width: 732px;
`;
