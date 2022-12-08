import * as Platform from '@voiceflow/platform-config';
import { Banner, Link } from '@voiceflow/ui';
import React from 'react';

import * as Session from '@/ducks/session';
import { useSelector } from '@/hooks';
import { SecretsConfigSection, SettingsContainer, WebhookField } from '@/pages/Publish/components';

import { useSecretsManager } from '../hooks';
import { secretsConfig } from './constants';

const MicrosoftTeams: React.FC = () => {
  const secrets = React.useMemo(() => secretsConfig.map(({ secretTag }) => secretTag), [secretsConfig]);

  const projectID = useSelector(Session.activeProjectIDSelector)!;

  const { secretsStore, updateSecret, submitSecrets } = useSecretsManager(
    projectID,
    {
      secrets,
    },
    Platform.Constants.PlatformType.MICROSOFT_TEAMS
  );

  return (
    <SettingsContainer>
      <Banner
        title="Publishing to Microsoft Teams"
        subtitle="Make your assistant instantly accessible on Microsoft Teams."
        buttonText="Documentation"
        isCloseable={false}
      />
      <WebhookField platformName="ms-teams" />
      <SecretsConfigSection
        title="Configuration"
        secretsStore={secretsStore}
        updateSecret={updateSecret}
        submitSecrets={submitSecrets}
        subtitle={
          <>
            Copy paste your Bot ID and Client Secret to connect your assistant to Microsoft Teams.{' '}
            <Link href="https://www.voiceflow.com/">Learn more</Link>
          </>
        }
        secrets={secretsConfig}
      />
    </SettingsContainer>
  );
};

export default MicrosoftTeams;
