import React from 'react';

import Drawer from '@/components/Drawer';
import { FeatureFlag } from '@/config/features';
import * as Creator from '@/ducks/creator';
import * as Project from '@/ducks/project';
import * as Prototype from '@/ducks/prototype';
import { connect } from '@/hocs';
import { useFeature, useTheme } from '@/hooks';
import PrototypeDisplaySettings from '@/pages/Prototype/components/PrototypeDisplaySettings';
import PrototypeSettings from '@/pages/Prototype/components/PrototypeSettings';
import PrototypeSidebar from '@/pages/Prototype/components/PrototypeSidebar';
import PrototypeVariableSettings from '@/pages/Prototype/components/PrototypeVariableSettings';
import PrototypeVisualCanvas from '@/pages/Prototype/components/PrototypeVisualCanvas';
import { PrototypeIconMenu } from '@/pages/Skill/components/Sidebar/components';
import { usePrototypingMode } from '@/pages/Skill/hooks';
import { SlideOutDirection } from '@/styles/transitions';
import { ConnectedProps } from '@/types';
import { isAnyGeneralPlatform } from '@/utils/typeGuards';

const PrototypeOverlay: React.FC<ConnectedDiagramProps> = ({ platform, prototypeMode, showCanvas, hideCanvas }) => {
  const theme = useTheme();
  const isPrototypingMode = usePrototypingMode();

  const widthRef = React.useRef(0);
  const navigationRedesign = useFeature(FeatureFlag.NAVIGATION_REDESIGN);
  const isCanvasVisible = !isPrototypingMode || prototypeMode !== Prototype.PrototypeMode.DISPLAY;

  React.useEffect(() => {
    if (isCanvasVisible) return undefined;

    hideCanvas();

    return () => {
      showCanvas();
    };
  }, [isCanvasVisible]);

  const isPrototypeDisplay = prototypeMode === Prototype.PrototypeMode.DISPLAY;
  const isPrototypeVariables = prototypeMode === Prototype.PrototypeMode.VARIABLES;
  const isPrototypeSettings = prototypeMode === Prototype.PrototypeMode.SETTINGS;

  const getPrototypeSettingsWidth = () => {
    if (isPrototypeDisplay) {
      return theme.components.displaySettings.width;
    }

    if (isPrototypeVariables || isPrototypeSettings) {
      return theme.components.developerSettings.width;
    }

    return widthRef.current;
  };

  widthRef.current = getPrototypeSettingsWidth();

  const isGeneral = isAnyGeneralPlatform(platform);
  const isPrototypeSidebarOpened = isPrototypeVariables || isPrototypeSettings || (isPrototypeDisplay && !isGeneral);

  return (
    <>
      {/* prototyping mode */}
      {isPrototypingMode && <PrototypeSidebar open />}
      {isPrototypingMode && !navigationRedesign.isEnabled && <PrototypeIconMenu />}

      {isPrototypingMode && (
        <>
          <PrototypeVisualCanvas isShown={isPrototypeDisplay} />

          <Drawer
            open={isPrototypeSidebarOpened}
            width={widthRef.current}
            offset={theme.components.sidebarIconMenu.width}
            direction={SlideOutDirection.RIGHT}
          >
            {isPrototypeVariables && <PrototypeVariableSettings />}
            {isPrototypeDisplay && <PrototypeDisplaySettings />}
            {isPrototypeSettings && <PrototypeSettings />}
          </Drawer>
        </>
      )}
    </>
  );
};

const mapStateToProps = {
  platform: Project.activePlatformSelector,
  prototypeMode: Prototype.activePrototypeModeSelector,
};

const mapDispatchToProps = {
  hideCanvas: Creator.hideCanvas,
  showCanvas: Creator.showCanvas,
};

type ConnectedDiagramProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(PrototypeOverlay) as React.FC;
