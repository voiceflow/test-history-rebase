import { Banner, Link } from '@voiceflow/ui';
import React from 'react';

import * as Settings from '@/components/Settings';
import { WHATSAPP_DOCUMENTATION } from '@/constants/platforms';
import { openInternalURLInANewTab } from '@/utils/window';

import * as PublishingComponents from '../components';

const WhatsApp: React.FC = () => (
  <Settings.PageContent>
    <Settings.Section>
      <Banner
        title="Publishing to WhatsApp Business"
        onClick={() => openInternalURLInANewTab(WHATSAPP_DOCUMENTATION)}
        subtitle="Make your agent instantly accessible on WhatsApp."
        buttonText="Documentation"
      />
    </Settings.Section>

    <PublishingComponents.WebhookField
      description={
        <>
          Voiceflow uses Twilio as its messaging partner for WhatsApp Business Messaging.{' '}
          <Link href={WHATSAPP_DOCUMENTATION}>Learn More</Link>
        </>
      }
      platformName="twilio-messaging"
    />
  </Settings.PageContent>
);

export default WhatsApp;
