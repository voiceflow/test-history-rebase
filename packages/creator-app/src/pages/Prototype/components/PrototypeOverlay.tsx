import React from 'react';

import Drawer from '@/components/Drawer';
import { FeatureFlag } from '@/config/features';
import { PrototypeMode } from '@/constants/prototype';
import * as Creator from '@/ducks/creator';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Prototype from '@/ducks/prototype';
import { useDispatch, useFeature, useSelector, useTheme } from '@/hooks';
import { usePrototypingMode } from '@/pages/Project/hooks';
import PrototypeDisplaySettings from '@/pages/Prototype/components/PrototypeDisplaySettings';
import PrototypeSettings from '@/pages/Prototype/components/PrototypeSettings';
import PrototypeSidebar from '@/pages/Prototype/components/PrototypeSidebar';
import PrototypeVariableSettings from '@/pages/Prototype/components/PrototypeVariableSettings';
import PrototypeVisualCanvas from '@/pages/Prototype/components/PrototypeVisualCanvas';
import { isVoiceflowPlatform } from '@/utils/typeGuards';

const PrototypeOverlay: React.FC = () => {
  const theme = useTheme();
  const isPrototypingMode = usePrototypingMode();
  const { isEnabled: hasVariableStates } = useFeature(FeatureFlag.VARIABLE_STATES);

  const platform = useSelector(ProjectV2.active.platformSelector);
  const prototypeMode = useSelector(Prototype.activePrototypeModeSelector);

  const hideCanvas = useDispatch(Creator.hideCanvas);
  const showCanvas = useDispatch(Creator.showCanvas);

  const widthRef = React.useRef(0);
  const isCanvasVisible = !isPrototypingMode || prototypeMode !== PrototypeMode.DISPLAY;

  React.useEffect(() => {
    if (isCanvasVisible) return undefined;

    hideCanvas();

    return () => {
      showCanvas();
    };
  }, [isCanvasVisible]);

  const isPrototypeDisplay = prototypeMode === PrototypeMode.DISPLAY;
  const isPrototypeVariables = prototypeMode === PrototypeMode.VARIABLES;
  const isPrototypeSettings = prototypeMode === PrototypeMode.SETTINGS;

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

  const isGeneral = isVoiceflowPlatform(platform);
  const isPrototypeSidebarOpened = isPrototypeVariables || isPrototypeSettings || (isPrototypeDisplay && !isGeneral);

  return !isPrototypingMode ? null : (
    <>
      <PrototypeSidebar open />
      <PrototypeVisualCanvas isShown={isPrototypeDisplay} />

      {!hasVariableStates && (
        <Drawer
          open={isPrototypeSidebarOpened}
          width={widthRef.current}
          offset={theme.components.sidebarIconMenu.width}
          direction={Drawer.Direction.RIGHT}
        >
          {isPrototypeVariables && <PrototypeVariableSettings />}
          {isPrototypeDisplay && <PrototypeDisplaySettings />}
          {isPrototypeSettings && <PrototypeSettings showTitle />}
        </Drawer>
      )}
    </>
  );
};

export default PrototypeOverlay;
