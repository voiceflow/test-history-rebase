import { Banner, Box, BoxFlex, BoxFlexCenter } from '@voiceflow/ui';

import { styled } from '@/hocs';

export type { InputField, SecretField } from './SecretsConfigSection';
export { default as SecretsConfigSection } from './SecretsConfigSection';
export { default as Section } from './Section';
export { default as WebhookField } from './WebhookField';

export const FlatCard = styled(Box)`
  padding: 24px 32px;
  border-radius: 5px;
  border: solid 1px #dfe3ed;
  background-color: #fdfdfd;
`;

export const ContentContainer = styled(BoxFlex)`
  flex-direction: column;
  padding: 32px;
  align-items: flex-start;
`;

export const ContentSection = styled(BoxFlexCenter)`
  margin-bottom: 32px;
  width: 724px;
  align-items: flex-end;
`;

export const ActionContainer = styled.div`
  width: 250px;
  position: relative;

  & > div {
    float: right;
  }
`;

export const SettingsContainer = styled(Box.Flex)`
  flex-direction: column;
  padding: 32px;
  height: 100%;
  overflow-y: scroll;
  max-width: 764px;

  & ${Banner.OuterContainer} {
    margin-bottom: 32px;
  }
`;
