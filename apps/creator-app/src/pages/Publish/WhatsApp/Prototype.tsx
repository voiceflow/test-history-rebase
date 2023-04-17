import { ProjectSecretTag } from '@voiceflow/schema-types';
import { Banner, toast } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import PhoneInput, { isValidPhoneNumber, PhoneNumber } from '@/components/PhoneInput';
import * as Settings from '@/components/Settings';
import { WHATSAPP_DOCUMENTATION } from '@/constants/platforms';
import * as Session from '@/ducks/session';
import { useAsyncEffect, useSelector } from '@/hooks';
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

    await client.apiV3.projectSecret.create(projectID, ProjectSecretTag.WHATSAPP_PHONE_NUMBER, number);

    setRemoteValue(number);

    toast.success('Saved');
    setError(false);
  };

  return (
    <Settings.PageContent>
      <Settings.Section>
        <Banner
          title="Test Your Assistant on WhatsApp"
          onClick={() => openInternalURLInANewTab(WHATSAPP_DOCUMENTATION)}
          subtitle="Add your number and start testing with a single click."
          buttonText="Documentation"
        />
      </Settings.Section>

      <Settings.Section title="Testing Number">
        <Settings.Card>
          <Settings.SubSection header="WhatsApp Number" splitView>
            <PhoneInput
              value={value}
              error={error}
              onBlur={updateValue}
              onChange={setValue}
              disabled={loading}
              placeholder="Enter WhatsApp number"
              defaultCountry="US"
            />

            <Settings.SubSection.Description>The WhatsApp number you'll use to test your assistant.</Settings.SubSection.Description>
          </Settings.SubSection>
        </Settings.Card>
      </Settings.Section>
    </Settings.PageContent>
  );
};

export default WhatsAppTesting;
