import { Box, Button, ButtonVariant, Input } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import * as Settings from '@/components/Settings';
import { RUNTIME_API_ENDPOINT } from '@/config';
import { Permission } from '@/constants/permissions';
import * as Session from '@/ducks/session';
import { useAsyncEffect, useHasPermissions, useSelector } from '@/hooks';
import { copyWithToast } from '@/utils/clipboard';

interface WebhookFieldProps {
  description?: React.ReactNode;
  platformName: string;
}

const WebhookField: React.FC<WebhookFieldProps> = ({ description, platformName }) => {
  const hasPermissions = useHasPermissions([Permission.API_KEY_EDIT, Permission.API_KEY_VIEW]);
  const [primaryKey, setPrimaryKey] = React.useState<string | null>(null);

  const projectID = useSelector(Session.activeProjectIDSelector)!;
  const workspaceID = useSelector(Session.activeWorkspaceIDSelector)!;

  const webhookURL = React.useMemo(
    () => `${RUNTIME_API_ENDPOINT}/v1/adapter/${platformName}/webhook/interact/${projectID}?apiKey=${primaryKey}`,
    [primaryKey]
  );

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

  if (!hasPermissions) return null;

  return (
    <Settings.Section title="Webhook" description={description}>
      <Settings.Card>
        <Settings.SubSection header="Webhook URL">
          <Box.Flex gap={12}>
            <Input value={webhookURL} disabled />

            <Button variant={ButtonVariant.SECONDARY} squareRadius flat onClick={copyWithToast(webhookURL)}>
              Copy
            </Button>
          </Box.Flex>
        </Settings.SubSection>
      </Settings.Card>
    </Settings.Section>
  );
};

export default WebhookField;
