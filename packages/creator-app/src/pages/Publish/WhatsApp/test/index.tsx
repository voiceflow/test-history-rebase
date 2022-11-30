import { ProjectSecretTag } from '@voiceflow/schema-types';
import { Box, Button, FullSpinner, ThemeColor, toast } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import PhoneInput, { formatPhoneNumber, isValidPhoneNumber, PhoneNumber } from '@/components/PhoneInput';
import * as Session from '@/ducks/session';
import { useAsyncEffect, useSelector } from '@/hooks';
import { Section } from '@/pages/Publish/components';

import { BannerSection, SettingsContainer } from '../styled';

const WhatsAppTesting: React.FC = () => {
  const [loading, setLoading] = React.useState(true);
  const [value, setValue] = React.useState<PhoneNumber | undefined>();
  const [hasNumber, setHasNumber] = React.useState(false);
  const [error, setError] = React.useState(false);

  const projectID = useSelector(Session.activeProjectIDSelector)!;

  useAsyncEffect(async () => {
    const projectSecret = await client.apiV3.projectSecret.findByProjectID(projectID, ProjectSecretTag.WHATSAPP_PHONE_NUMBER);
    setValue(projectSecret?.secret);
    setHasNumber(!!projectSecret);

    setLoading(false);
  }, []);

  const updateValue = async () => {
    const number = value as string;

    if (!number || !isValidPhoneNumber(number)) {
      toast.error('Invalid WhatsApp number');
      setError(true);
      return;
    }
    setError(false);

    await client.apiV3.projectSecret.create(projectID, ProjectSecretTag.WHATSAPP_PHONE_NUMBER, number, number);
    toast.success(`Message sent to ${formatPhoneNumber(number)}`);
  };

  if (loading) {
    return <FullSpinner />;
  }

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
          <PhoneInput defaultCountry="US" error={error} placeholder="Enter WhatsApp number" value={value} onChange={setValue} />
          <Box flexBasis="48%" flexShrink={0} fontSize={13}>
            The WhatsApp number you'll use to test your assistant.
          </Box>
        </Box.Flex>
        <Section.Divider />
        <Box.Flex flexDirection="row-reverse">
          <Button onClick={updateValue}>{`${hasNumber ? 'Update' : 'Add'} Number & Test`}</Button>
        </Box.Flex>
      </Section>
    </SettingsContainer>
  );
};

export default WhatsAppTesting;
