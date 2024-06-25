import * as Platform from '@voiceflow/platform-config';
import { Banner, Box, Link, Select, TippyTooltip, toast } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import * as Settings from '@/components/Settings';
import { SMS_DOCUMENTATION } from '@/constants/platforms';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import { useAsyncEffect, useDispatch, useSelector } from '@/hooks';
import { SecretsConfigSection } from '@/pages/Publish/components';
import type { MessagingServiceType } from '@/platforms/sms/types';
import { openInternalURLInANewTab } from '@/utils/window';

import { useSecretsManager } from '../hooks';
import { serviceOptionRenderer } from './components';
import { SECRETS_CONFIG } from './constants';

const SMS: React.FC = () => {
  const secrets = React.useMemo(() => SECRETS_CONFIG.map(({ secretTag }) => secretTag), []);

  const projectID = useSelector(Session.activeProjectIDSelector)!;

  const { loaded, secretsStore, updateSecret, submitSecrets } = useSecretsManager(
    projectID,
    { secrets },
    Platform.Constants.PlatformType.SMS
  );

  const [services, setServices] = React.useState<Record<string, MessagingServiceType & { disabled: boolean }> | null>(
    null
  );

  const projectPlatformData = useSelector(ProjectV2.active.platformDataSelector);
  const patchProjectPlatformData = useDispatch(ProjectV2.patchActivePlatformData);

  const updateMessagingServiceID = async (messagingServiceID?: string | null) => {
    if (!messagingServiceID) return;
    await patchProjectPlatformData({ messagingServiceID });
    toast.success('Messaging service connected, agent ready for publishing.');
  };

  const updateServices = async () => {
    const services = await client.platform.sms.getServices(projectID, { numbers: true });
    setServices(
      Object.fromEntries(services.map((service) => [service.id, { ...service, disabled: !service.numbers?.length }]))
    );
  };

  const checkPermissions = async () => {
    try {
      await updateServices();
      toast.success('Saved');
    } catch {
      toast.error(<>Unable to connect to Twilio.</>);
    }
  };

  useAsyncEffect(async () => {
    if (!loaded || !Object.values(secretsStore).every(Boolean)) return;
    await updateServices();
  }, [loaded]);

  return (
    <Settings.PageContent>
      <Settings.Section>
        <Banner
          title="Publishing to Twilio SMS"
          subtitle="Make your agent instantly accessible on SMS via Twilio."
          buttonText="Documentation"
          onClick={() => openInternalURLInANewTab(SMS_DOCUMENTATION)}
        />
      </Settings.Section>
      <SecretsConfigSection
        title="Twilio Credentials"
        secretsStore={secretsStore}
        onSuccess={checkPermissions}
        updateSecret={updateSecret}
        submitSecrets={submitSecrets}
        description={
          <>
            Copy paste your Account SID, API Key and API Secret to connect your agent to Twilio.{' '}
            <Link href={SMS_DOCUMENTATION}>Learn more</Link>
          </>
        }
        secrets={SECRETS_CONFIG}
      />
      <Settings.Section
        title="Messaging Service"
        description={
          <>
            Select a Twilio messaging service to associate with this agent.{' '}
            <Link href={SMS_DOCUMENTATION}>Learn more</Link>
          </>
        }
      >
        <Settings.Card>
          <Settings.SubSection header="Messaging Service" splitView>
            <TippyTooltip
              disabled={!!services}
              style={{ width: '100%' }}
              position="right-end"
              content={
                <Box width={200} my={4}>
                  You must complete and save the 'Twilio Credentials' section above before adding a messaging service.
                </Box>
              }
            >
              <Select
                value={projectPlatformData.messagingServiceID}
                disabled={!services}
                options={Object.values(services ?? {})}
                getOptionValue={(option) => option?.id}
                getOptionKey={(option) => option?.id}
                getOptionLabel={(serviceID?: string | null) => serviceID && services?.[serviceID]?.name}
                renderOptionLabel={serviceOptionRenderer}
                clearable={false}
                onSelect={updateMessagingServiceID}
                placeholder="Select a service"
              />
            </TippyTooltip>
            <Settings.SubSection.Description>
              The messaging service that will be integrated with this agent.
            </Settings.SubSection.Description>
          </Settings.SubSection>
        </Settings.Card>
      </Settings.Section>
    </Settings.PageContent>
  );
};

export default SMS;
