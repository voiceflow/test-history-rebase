import { Box, Button, ButtonVariant, Input, Link, ThemeColor } from '@voiceflow/ui';
import React from 'react';

import { Section } from '@/pages/Publish/components';

import { BannerSection, SettingsContainer } from './styled';

const Webchat: React.FC = () => {
  return (
    <SettingsContainer>
      <BannerSection>
        <Box.FlexApart>
          <div>
            <Box fontWeight={700} fontSize={18} color={ThemeColor.PRIMARY} mb={2}>
              Publishing to WhatsApp Business
            </Box>
            Make your assistant instantly accessible on WhatsApp.
          </div>
          <Button>Documentation</Button>
        </Box.FlexApart>
      </BannerSection>
      <Section
        title="Webhook"
        subtitle={
          <>
            Voiceflow uses Twilio as its messaging partner for WhatsApp Business Messaging. <Link>Learn More</Link>
          </>
        }
      >
        <Box mb={12} fontWeight={600}>
          Webhook URL
        </Box>
        <Box.Flex gap={12}>
          <Input value="yeet" disabled />
          <Button variant={ButtonVariant.SECONDARY} squareRadius flat>
            Copy
          </Button>
        </Box.Flex>
      </Section>
    </SettingsContainer>
  );
};

export default Webchat;
