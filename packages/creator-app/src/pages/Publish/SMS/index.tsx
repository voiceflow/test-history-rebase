import { Banner, Link } from '@voiceflow/ui';
import React from 'react';

import { WHATSAPP_DOCUMENTATION } from '@/constants/platforms';
import { SettingsContainer, WebhookField } from '@/pages/Publish/components';
import { openInternalURLInANewTab } from '@/utils/window';

const SMS: React.OldFC = () => (
  <SettingsContainer>
    <Banner
      title="Publishing to SMS"
      subtitle="Make your assistant instantly accessible via SMS."
      buttonText="Documentation"
      onClick={() => openInternalURLInANewTab(WHATSAPP_DOCUMENTATION)}
      isCloseable={false}
    />
    <WebhookField
      subtitle={
        <>
          Voiceflow uses Twilio as its messaging partner for SMS. <Link href={WHATSAPP_DOCUMENTATION}>Learn More</Link>
        </>
      }
      platformName="twilio-messaging"
    />
  </SettingsContainer>
);

export default SMS;
