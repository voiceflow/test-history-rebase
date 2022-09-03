import React from 'react';

import { Header } from '@/components/ProjectPage';
import { Permission } from '@/config/permissions';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { usePermission, useSelector } from '@/hooks';
import CanvasViewers from '@/pages/Project/components/CanvasViewers';

import { SharePopperProvider } from '../../contexts';
import { CanvasControls, DomainsAndCanvasActions, LogoButton, Run, Share, TrialExpired, Upload } from './components';

const CanvasHeader: React.FC = () => {
  const organizationTrialExpired = useSelector(WorkspaceV2.active.organizationTrialExpired);
  const [canPublish] = usePermission(Permission.CANVAS_PUBLISH);

  return (
    <SharePopperProvider>
      <Header renderLogoButton={() => <LogoButton />}>
        <CanvasControls />

        <DomainsAndCanvasActions />

        {organizationTrialExpired ? (
          <TrialExpired />
        ) : (
          <>
            <CanvasViewers flat withAdd={false} />

            <Share />

            {canPublish && <Upload />}

            <Run />
          </>
        )}
      </Header>
    </SharePopperProvider>
  );
};

export default CanvasHeader;
