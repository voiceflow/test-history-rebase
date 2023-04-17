import * as Platform from '@voiceflow/platform-config';
import { Banner, Link } from '@voiceflow/ui';
import React from 'react';

import * as Settings from '@/components/Settings';
import { MS_TEAMS_DOCUMENTATION } from '@/constants/platforms';
import * as Session from '@/ducks/session';
import { useSelector } from '@/hooks';
import { openInternalURLInANewTab } from '@/utils/window';

import { SecretsConfigSection, WebhookField } from '../components';
import { useSecretsManager } from '../hooks';
import { secretsConfig } from './constants';

const MicrosoftTeams: React.FC = () => {
  const secrets = React.useMemo(() => secretsConfig.map(({ secretTag }) => secretTag), [secretsConfig]);

  const projectID = useSelector(Session.activeProjectIDSelector)!;

  const { secretsStore, updateSecret, submitSecrets } = useSecretsManager(projectID, { secrets }, Platform.Constants.PlatformType.MICROSOFT_TEAMS);

  return (
    <Settings.PageContent>
      <Settings.Section>
        <Banner
          small
          title="Publishing to Microsoft Teams"
          onClick={() => openInternalURLInANewTab(MS_TEAMS_DOCUMENTATION)}
          subtitle="Make your assistant instantly accessible on Microsoft Teams."
          buttonText="Documentation"
        />
      </Settings.Section>

      <WebhookField platformName="ms-teams" />

      <SecretsConfigSection
        title="Configuration"
        secrets={secretsConfig}
        secretsStore={secretsStore}
        updateSecret={updateSecret}
        submitSecrets={submitSecrets}
        description={
          <>
            Copy paste your Bot ID and Client Secret to connect your assistant to Microsoft Teams.{' '}
            <Link href={MS_TEAMS_DOCUMENTATION}>Learn more</Link>
          </>
        }
      />
    </Settings.PageContent>
  );
};

export default MicrosoftTeams;
