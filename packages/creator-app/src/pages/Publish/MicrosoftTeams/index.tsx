import * as Platform from '@voiceflow/platform-config';
import { Link } from '@voiceflow/ui';
import React from 'react';

import { MS_TEAMS_DOCUMENTATION } from '@/constants/platforms';
import * as Session from '@/ducks/session';
import { useSelector } from '@/hooks';
import { openInternalURLInANewTab } from '@/utils/window';

import { useSecretsManager } from '../hooks';
import { secretsConfig } from './constants';
import * as S from './styles';

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
    <S.Container>
      <S.Banner
        title="Publishing to Microsoft Teams"
        subtitle="Make your assistant instantly accessible on Microsoft Teams."
        buttonText="Documentation"
        onClick={() => openInternalURLInANewTab(MS_TEAMS_DOCUMENTATION)}
        isCloseable={false}
        small
      />
      <S.WebhookField platformName="ms-teams" />
      <S.SecretsConfigSection
        title="Configuration"
        secretsStore={secretsStore}
        updateSecret={updateSecret}
        submitSecrets={submitSecrets}
        subtitle={
          <>
            Copy paste your Bot ID and Client Secret to connect your assistant to Microsoft Teams.{' '}
            <Link href={MS_TEAMS_DOCUMENTATION}>Learn more</Link>
          </>
        }
        secrets={secretsConfig}
      />
    </S.Container>
  );
};

export default MicrosoftTeams;
