import { Link } from '@voiceflow/ui';
import React from 'react';

import { PublishBanner, SettingsContainer, WebhookField } from '@/pages/Publish/components';

const WhatsApp: React.FC = () => (
  <SettingsContainer>
    <PublishBanner
      title="Publishing to WhatsApp Business"
      description="Make your assistant instantly accessible on WhatsApp."
      docUrl="https://www.voiceflow.com/"
    />
    <WebhookField
      subtitle={
        <>
          Voiceflow uses Twilio as its messaging partner for WhatsApp Business Messaging. <Link>Learn More</Link>
        </>
      }
      platformName="twilio-messaging"
    />
  </SettingsContainer>
);

export default WhatsApp;
