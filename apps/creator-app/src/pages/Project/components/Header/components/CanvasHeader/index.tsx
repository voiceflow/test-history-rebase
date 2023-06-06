import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { ButtonVariant } from '@voiceflow/ui';
import React from 'react';

import Page from '@/components/Page';
import { Permission } from '@/constants/permissions';
import { useActiveProjectPlatformConfig, useFeature, usePermission } from '@/hooks';
import CanvasViewers from '@/pages/Project/components/CanvasViewers';

import { SharePopperProvider } from '../../contexts';
import { CanvasActions, CanvasControls, LogoButton, Run, Share, TrialExpired, Upload } from './components';
import { ActionRow } from './styled';

const CanvasHeader: React.FC = () => {
  const canvasPublish = usePermission(Permission.CANVAS_PUBLISH);
  const sunsetDFES = useFeature(Realtime.FeatureFlag.SUNSET_DFES);

  const platformConfig = useActiveProjectPlatformConfig();

  const showOneClickPublish =
    platformConfig.oneClickPublish && (platformConfig.type === Platform.Constants.PlatformType.DIALOGFLOW_ES ? !sunsetDFES.isEnabled : true);

  const showUpload = canvasPublish.allowed && (platformConfig.type === Platform.Constants.PlatformType.DIALOGFLOW_ES ? !sunsetDFES.isEnabled : true);

  return (
    <SharePopperProvider>
      <Page.Header renderLogoButton={() => <LogoButton />}>
        <CanvasControls />

        <CanvasActions />

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
    </SharePopperProvider>
  );
};

export default CanvasHeader;
