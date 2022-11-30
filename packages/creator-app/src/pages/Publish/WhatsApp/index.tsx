import { Box, Button, ButtonVariant, Input, Link, ThemeColor } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import { RUNTIME_API_ENDPOINT } from '@/config';
import { Permission } from '@/config/permissions';
import * as Session from '@/ducks/session';
import { useAsyncEffect, usePermissions, useSelector } from '@/hooks';
import { Section } from '@/pages/Publish/components';
import { copyWithToast } from '@/utils/clipboard';

import { BannerSection, SettingsContainer } from './styled';

const WhatsApp: React.FC = () => {
  const hasPermissions = usePermissions([Permission.API_KEY_EDIT, Permission.API_KEY_VIEW]);
  const [primaryKey, setPrimaryKey] = React.useState<string | null>(null);

  const workspaceID = useSelector(Session.activeWorkspaceIDSelector)!;
  const projectID = useSelector(Session.activeProjectIDSelector)!;

  useAsyncEffect(async () => {
    if (!hasPermissions) return;

    const apiKeys = await client.project.listAPIKeys(projectID);

    if (apiKeys.length > 0) {
      // first look for key that has secondaryKeyID property
      setPrimaryKey((apiKeys.find((key) => key?.secondaryKeyID !== undefined) ?? apiKeys[0]).key);
      return;
    }

    setPrimaryKey((await client.project.createAPIKey({ workspaceID, projectID })).key);
  }, []);

  const webhookURL = React.useMemo(
    () => `${RUNTIME_API_ENDPOINT}/v/adapter/twilio-messaging/webhook/interact/${projectID}?apiKey=${primaryKey}`,
    [primaryKey]
  );

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
      {hasPermissions && (
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
            <Input value={webhookURL} disabled />
            <Button variant={ButtonVariant.SECONDARY} squareRadius flat onClick={copyWithToast(webhookURL)}>
              Copy
            </Button>
          </Box.Flex>
        </Section>
      )}
    </SettingsContainer>
  );
};

export default WhatsApp;
