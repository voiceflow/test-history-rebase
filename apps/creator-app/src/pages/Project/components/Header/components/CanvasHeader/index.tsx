import * as Platform from '@voiceflow/platform-config';
import { ButtonVariant } from '@voiceflow/ui';
import React from 'react';

import Page from '@/components/Page';
import { Permission } from '@/constants/permissions';
import { useActiveProjectPlatformConfig, usePermission } from '@/hooks';
import CanvasViewers from '@/pages/Project/components/CanvasViewers';

import { CanvasControls, DomainsAndCanvasActions, LogoButton, Run, Share, TrialExpired, Upload } from './components';
import { ActionRow } from './styled';

const CanvasHeader: React.FC = () => {
  const canvasPublish = usePermission(Permission.CANVAS_PUBLISH);

  const platformConfig = useActiveProjectPlatformConfig();

  const showOneClickPublish = platformConfig.oneClickPublish && platformConfig.type !== Platform.Constants.PlatformType.DIALOGFLOW_ES;

  const showUpload = canvasPublish.allowed && platformConfig.type !== Platform.Constants.PlatformType.DIALOGFLOW_ES;

  return (
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
            {showOneClickPublish && <Run variant={ButtonVariant.SECONDARY} />}

            {showUpload && <Upload />}

            {!platformConfig.oneClickPublish && <Run />}
          </ActionRow>
        </>
      )}
    </Page.Header>
  );
};

export default CanvasHeader;
