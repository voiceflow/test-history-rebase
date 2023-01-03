import { Banner as BaseBanner } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';
import { SettingsContainer } from '@/pages/Publish/components';
import * as PublishComponents from '@/pages/Publish/components';

export const Banner = styled(BaseBanner)`
  ${BaseBanner.ButtonBox} {
    padding-right: 32px;
    padding-left: 0px;
  }
`;

export const WebhookField = styled(PublishComponents.WebhookField)`
  padding: 0;
  margin-bottom: 32px;

  ${PublishComponents.Section.Card} {
    padding: 24px 28px 24px 32px;
  }
`;

export const SecretsConfigSection = styled(PublishComponents.SecretsConfigSection)`
  padding: 0;
`;

export const Container = styled(SettingsContainer)`
  padding: 32px;
  margin: 0px;
  min-width: 764px;

  ${Banner} {
    padding: 0px;
    margin: 0px 0px 32px 0;
  }
`;
