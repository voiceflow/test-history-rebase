import { ProjectSecretTag } from '@voiceflow/schema-types';
import { Banner, Box, FullSpinner, toast } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import PhoneInput, { isValidPhoneNumber, PhoneNumber } from '@/components/PhoneInput';
import { WHATSAPP_DOCUMENTATION } from '@/constants/platforms';
import * as Session from '@/ducks/session';
import { useAsyncEffect, useSelector } from '@/hooks';
import { Section, SettingsContainer } from '@/pages/Publish/components';
import { openInternalURLInANewTab } from '@/utils/window';

const WhatsAppTesting: React.FC = () => {
  const [loading, setLoading] = React.useState(true);
  const [remoteValue, setRemoteValue] = React.useState<string | undefined>();
  const [value, setValue] = React.useState<PhoneNumber | undefined>();
  const [error, setError] = React.useState(false);

  const projectID = useSelector(Session.activeProjectIDSelector)!;

  useAsyncEffect(async () => {
    const projectSecret = await client.apiV3.projectSecret.findByProjectID(projectID, ProjectSecretTag.WHATSAPP_PHONE_NUMBER);
    setValue(projectSecret?.secret);
    setRemoteValue(projectSecret?.secret);

    setLoading(false);
  }, []);

  const updateValue = async () => {
    const number = value as string;

    // don't do anything if nothing has changed
    if (number === remoteValue) return;

    if (!number) {
      await client.apiV3.projectSecret.delete(projectID, ProjectSecretTag.WHATSAPP_PHONE_NUMBER);
      toast.success('Number removed');
      setError(false);
      return;
    }

    if (!isValidPhoneNumber(number)) {
      toast.error('Invalid WhatsApp number');
      setError(true);
      return;
    }

    await client.apiV3.projectSecret.create(projectID, ProjectSecretTag.WHATSAPP_PHONE_NUMBER, number, number);

    setRemoteValue(number);

    toast.success('Saved');
    setError(false);
  };

  if (loading) {
    return <FullSpinner />;
  }

  return (
    <SettingsContainer>
      <Banner
        title="Test Your Assistant on WhatsApp"
        subtitle="Add your number and start testing with a single click."
        buttonText="Documentation"
        onClick={() => openInternalURLInANewTab(WHATSAPP_DOCUMENTATION)}
        isCloseable={false}
      />
      <Section title="Testing Number">
        <Box mb={12} fontWeight={600}>
          WhatsApp Number
        </Box>
        <Box.Flex gap={24}>
          <PhoneInput defaultCountry="US" error={error} placeholder="Enter WhatsApp number" value={value} onChange={setValue} onBlur={updateValue} />
          <Box flexBasis="48%" flexShrink={0} fontSize={13}>
            The WhatsApp number you'll use to test your assistant.
          </Box>
        </Box.Flex>
      </Section>
    </SettingsContainer>
  );
};

export default WhatsAppTesting;
