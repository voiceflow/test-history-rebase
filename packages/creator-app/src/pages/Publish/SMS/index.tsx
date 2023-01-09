import { Banner, Link } from '@voiceflow/ui';
import React from 'react';

import * as Settings from '@/components/Settings';
import { WHATSAPP_DOCUMENTATION } from '@/constants/platforms';
import { openInternalURLInANewTab } from '@/utils/window';

import { WebhookField } from '../components';

const SMS: React.FC = () => (
  <Settings.PageContent>
    <Settings.Section>
      <Banner
        title="Publishing to SMS"
        onClick={() => openInternalURLInANewTab(WHATSAPP_DOCUMENTATION)}
        subtitle="Make your assistant instantly accessible via SMS."
        buttonText="Documentation"
      />
    </Settings.Section>

    <WebhookField
      description={
        <>
          Voiceflow uses Twilio as its messaging partner for SMS. <Link href={WHATSAPP_DOCUMENTATION}>Learn More</Link>
        </>
      }
      platformName="twilio-messaging"
    />
  </Settings.PageContent>
);

export default SMS;
