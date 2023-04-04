import { ButtonVariant } from '@voiceflow/ui';
import React from 'react';

import Page from '@/components/Page';
import { Permission } from '@/constants/permissions';
import { useActiveProjectPlatformConfig, usePermission } from '@/hooks';
import CanvasViewers from '@/pages/Project/components/CanvasViewers';

import { SharePopperProvider } from '../../contexts';
import { CanvasControls, DomainsAndCanvasActions, LogoButton, Run, Share, TrialExpired, Upload } from './components';
import { ActionRow } from './styled';

const CanvasHeader: React.FC = () => {
  const canvasPublish = usePermission(Permission.CANVAS_PUBLISH);

  const platformConfig = useActiveProjectPlatformConfig();

  return (
    <SharePopperProvider>
      <Page.Header renderLogoButton={() => <LogoButton />}>
        <CanvasControls />

        <DomainsAndCanvasActions />

        {canvasPublish.organizationTrialExpired ? (
          <TrialExpired />
        ) : (
          <>
            <CanvasViewers />

            <ActionRow gap={8}>
              <Share />
              {platformConfig.oneClickPublish && <Run variant={ButtonVariant.SECONDARY} />}

              {canvasPublish.allowed && <Upload />}

              {!platformConfig.oneClickPublish && <Run />}
            </ActionRow>
          </>
        )}
      </Page.Header>
    </SharePopperProvider>
  );
};

export default CanvasHeader;
