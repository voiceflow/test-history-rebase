import React from 'react';

import Drawer from '@/components/Drawer';
import * as Creator from '@/ducks/creator';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Prototype from '@/ducks/prototype';
import { useDispatch, useSelector, useTheme } from '@/hooks';
import { usePrototypingMode } from '@/pages/Project/hooks';
import PrototypeDisplaySettings from '@/pages/Prototype/components/PrototypeDisplaySettings';
import PrototypeSettings from '@/pages/Prototype/components/PrototypeSettings';
import PrototypeSidebar from '@/pages/Prototype/components/PrototypeSidebar';
import PrototypeVariableSettings from '@/pages/Prototype/components/PrototypeVariableSettings';
import PrototypeVisualCanvas from '@/pages/Prototype/components/PrototypeVisualCanvas';
import { SlideOutDirection } from '@/styles/transitions';
import { isAnyGeneralPlatform } from '@/utils/typeGuards';

const PrototypeOverlay: React.FC = () => {
  const theme = useTheme();
  const isPrototypingMode = usePrototypingMode();

  const platform = useSelector(ProjectV2.active.platformSelector);
  const prototypeMode = useSelector(Prototype.activePrototypeModeSelector);

  const hideCanvas = useDispatch(Creator.hideCanvas);
  const showCanvas = useDispatch(Creator.showCanvas);

  const widthRef = React.useRef(0);
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

  return !isPrototypingMode ? null : (
    <>
      <PrototypeSidebar open />
      <PrototypeVisualCanvas isShown={isPrototypeDisplay} />

      <Drawer
        open={isPrototypeSidebarOpened}
        width={widthRef.current}
        offset={theme.components.sidebarIconMenu.width}
        direction={SlideOutDirection.RIGHT}
      >
        {isPrototypeVariables && <PrototypeVariableSettings />}
        {isPrototypeDisplay && <PrototypeDisplaySettings />}
        {isPrototypeSettings && <PrototypeSettings showTitle />}
      </Drawer>
    </>
  );
};

export default PrototypeOverlay;
