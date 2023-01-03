import { Box, Button, ButtonVariant, Input } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import { RUNTIME_API_ENDPOINT } from '@/config';
import { Permission } from '@/config/permissions';
import * as Session from '@/ducks/session';
import { useAsyncEffect, usePermissions, useSelector } from '@/hooks';
import { copyWithToast } from '@/utils/clipboard';

import Section from './Section';

interface WebhookFieldProps {
  subtitle?: JSX.Element | string;
  platformName: string;
  className?: string;
}

const WebhookField: React.FC<WebhookFieldProps> = ({ subtitle, platformName, className }) => {
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
    () => `${RUNTIME_API_ENDPOINT}/v1/adapter/${platformName}/webhook/interact/${projectID}?apiKey=${primaryKey}`,
    [primaryKey]
  );

  return (
    <>
      {hasPermissions && (
        <Section className={className} title="Webhook" subtitle={subtitle}>
          <Box mb={11} fontWeight={600}>
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
    </>
  );
};

export default WebhookField;
