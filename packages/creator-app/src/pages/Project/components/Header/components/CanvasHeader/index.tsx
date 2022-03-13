import React from 'react';

import { Header, HeaderDivider } from '@/components/ProjectPage';
import { Permission } from '@/config/permissions';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { usePermission, useSelector } from '@/hooks';
import CanvasViewers from '@/pages/Project/components/CanvasViewers';
import { PlatformContext } from '@/pages/Project/contexts';
import { isVoiceflowPlatform } from '@/utils/typeGuards';

import { SharePopperProvider } from '../../contexts';
import { CanvasControls, LogoButton, ProjectAndDiagramActions, Run, Share, TrialExpired, Upload } from './components';

const CanvasHeader: React.FC = () => {
  const platform = React.useContext(PlatformContext)!;
  const organizationTrialExpired = useSelector(WorkspaceV2.active.organizationTrialExpired);

  const [canPublish] = usePermission(Permission.CANVAS_PUBLISH);

  return (
    <SharePopperProvider>
      <Header renderLogoButton={() => <LogoButton />}>
        <CanvasControls />

        <HeaderDivider offset secondary />

        <ProjectAndDiagramActions />

        {organizationTrialExpired ? (
          <TrialExpired />
        ) : (
          <>
            <CanvasViewers flat withAdd={false} />

            <Share />

            {canPublish && !isVoiceflowPlatform(platform) && <Upload />}

            <Run />
          </>
        )}
      </Header>
    </SharePopperProvider>
  );
};

export default CanvasHeader;
