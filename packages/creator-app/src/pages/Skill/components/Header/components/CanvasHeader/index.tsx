import React from 'react';

import { Header, HeaderDivider } from '@/components/ProjectPage';
import CanvasViewers from '@/pages/Skill/components/CanvasViewers';
import { PlatformContext } from '@/pages/Skill/contexts';
import { isAnyGeneralPlatform } from '@/utils/typeGuards';

import { SharePopperProvider } from '../../contexts';
import { CanvasControls, LogoButton, ProjectAndDiagramActions, Run, Share, Upload } from './components';

const CanvasHeader: React.FC = () => {
  const platform = React.useContext(PlatformContext)!;

  return (
    <SharePopperProvider>
      <Header renderLogoButton={() => <LogoButton />}>
        <CanvasControls />

        <HeaderDivider offset secondary />

        <ProjectAndDiagramActions />

        <CanvasViewers flat withAdd={false} />

        <Share />

        {!isAnyGeneralPlatform(platform) && (
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
