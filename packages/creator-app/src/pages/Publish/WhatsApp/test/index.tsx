import { Box, Button, ThemeColor } from '@voiceflow/ui';
import React from 'react';

import PhoneInput, { PhoneNumber } from '@/components/PhoneInput';
import { Section } from '@/pages/Publish/components';

import { BannerSection, SettingsContainer } from '../styled';

const Webchat: React.FC = () => {
  const [value, setValue] = React.useState<PhoneNumber | undefined>();

  return (
    <SettingsContainer>
      <BannerSection>
        <Box.FlexApart>
          <div>
            <Box fontWeight={700} fontSize={18} color={ThemeColor.PRIMARY} mb={2}>
              Test Your Assistant on Whatsapp
            </Box>
            Add your number and start testing with a single click.
          </div>
          <Button>Documentation</Button>
        </Box.FlexApart>
      </BannerSection>
      <Section title="Testing Number">
        <Box mb={12} fontWeight={600}>
          WhatsApp Number
        </Box>
        <Box.Flex gap={24}>
          <PhoneInput placeholder="Enter WhatsApp number" value={value} onChange={setValue} />
          <Box flexBasis="48%" flexShrink={0} fontSize={13}>
            The WhatsApp number you'll use to test your assistant.
          </Box>
        </Box.Flex>
        <Section.Divider />
        <Box.Flex flexDirection="row-reverse">
          <Button>Add Number & Test</Button>
        </Box.Flex>
      </Section>
    </SettingsContainer>
  );
};

export default Webchat;
