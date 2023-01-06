import { ButtonVariant } from '@voiceflow/ui';
import React from 'react';

import Page from '@/components/Page';
import { Permission } from '@/config/permissions';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useActiveProjectPlatformConfig, usePermission, useSelector } from '@/hooks';
import CanvasViewers from '@/pages/Project/components/CanvasViewers';

import { SharePopperProvider } from '../../contexts';
import { CanvasControls, DomainsAndCanvasActions, LogoButton, Run, Share, TrialExpired, Upload } from './components';
import { ActionRow } from './styled';

const CanvasHeader: React.OldFC = () => {
  const organizationTrialExpired = useSelector(WorkspaceV2.active.organizationTrialExpired);
  const [canPublish] = usePermission(Permission.CANVAS_PUBLISH);

  const platformConfig = useActiveProjectPlatformConfig();

  return (
    <SharePopperProvider>
      <Page.Header renderLogoButton={() => <LogoButton />}>
        <CanvasControls />

        <DomainsAndCanvasActions />

        {organizationTrialExpired ? (
          <TrialExpired />
        ) : (
          <>
            <CanvasViewers flat withAdd={false} />

            <ActionRow>
              <Share />
              {platformConfig.oneClickPublish && <Run variant={ButtonVariant.SECONDARY} />}

              {canPublish && <Upload />}

              {!platformConfig.oneClickPublish && <Run />}
            </ActionRow>
          </>
        )}
      </Page.Header>
    </SharePopperProvider>
  );
};

export default CanvasHeader;
