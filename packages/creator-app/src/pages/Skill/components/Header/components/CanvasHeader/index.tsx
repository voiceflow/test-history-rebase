import React from 'react';

import { Header, HeaderDivider } from '@/components/ProjectPage';
import { Permission } from '@/config/permissions';
import { usePermission } from '@/hooks';
import CanvasViewers from '@/pages/Skill/components/CanvasViewers';
import { PlatformContext } from '@/pages/Skill/contexts';
import { isAnyGeneralPlatform } from '@/utils/typeGuards';

import { SharePopperProvider } from '../../contexts';
import { CanvasControls, LogoButton, ProjectAndDiagramActions, Run, Share, Upload } from './components';

const CanvasHeader: React.FC = () => {
  const platform = React.useContext(PlatformContext)!;
  const [canPublish] = usePermission(Permission.CANVAS_PUBLISH);

  return (
    <SharePopperProvider>
      <Header renderLogoButton={() => <LogoButton />}>
        <CanvasControls />

        <HeaderDivider offset secondary />

        <ProjectAndDiagramActions />

        <CanvasViewers flat withAdd={false} />

        <Share />

        {canPublish && !isAnyGeneralPlatform(platform) && (
          <>
            <HeaderDivider />

            <Upload />
          </>
        )}

        <HeaderDivider />

        <Run />
      </Header>
    </SharePopperProvider>
  );
};

export default CanvasHeader;
