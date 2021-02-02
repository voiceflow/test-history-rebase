import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useTheme } from 'styled-components';

import Drawer from '@/components/Drawer';
import { RemoveIntercom } from '@/components/IntercomChat';
import * as Creator from '@/ducks/creator';
import * as Prototype from '@/ducks/prototype';
import * as UI from '@/ducks/ui';
import { connect } from '@/hocs';
import { useEventualEngine, useTeardown } from '@/hooks';
import Canvas from '@/pages/Canvas';
import CanvasControls from '@/pages/Canvas/components/CanvasControls';
import TopPrompt from '@/pages/Canvas/components/TopPrompt';
import { ManagerProvider } from '@/pages/Canvas/contexts';
import { getManager } from '@/pages/Canvas/managers';
import PrototypeDeveloperSettings from '@/pages/Prototype/components/PrototypeDeveloperSettings';
import PrototypeDisplaySettings from '@/pages/Prototype/components/PrototypeDisplaySettings';
import PrototypeSidebar from '@/pages/Prototype/components/PrototypeSidebar';
import PrototypeVisualCanvas from '@/pages/Prototype/components/PrototypeVisualCanvas';
import ReadOnlyBadge from '@/pages/Prototype/components/ReadOnlyBadge';
import { useAnyModeOpen, useMarkupMode, usePrototypingMode } from '@/pages/Skill/hooks';
import DesignMenu from '@/pages/Skill/menus/DesignMenu';
import MarkupMenu from '@/pages/Skill/menus/MarkupMenu';
import PrototypeMenu from '@/pages/Skill/menus/PrototypeMenu';
import { Theme } from '@/styles/theme';
import { SlideOutDirection } from '@/styles/transitions';
import { ConnectedProps } from '@/types';

import DiagramSync from './DiagramSync';
import FlowControls from './FlowControls';
import MarkupImageLoading from './MarkupImageLoading';

export type DiagramProps = RouteComponentProps & {
  diagramID: string;
};

const Diagram: React.FC<DiagramProps & ConnectedDiagramProps> = ({ diagramID, prototypeMode, canvasOnly, showCanvas, hideCanvas }) => {
  const theme = useTheme() as Theme;
  const engine = useEventualEngine();
  const isMarkupMode = useMarkupMode();
  const isDesignMode = !useAnyModeOpen();
  const isPrototypingMode = usePrototypingMode();

  const widthRef = React.useRef(0);

  const isCanvasVisible = !isPrototypingMode || prototypeMode !== Prototype.PrototypeMode.DISPLAY;
  const isCanvasEditable = !isPrototypingMode;

  React.useEffect(() => {
    if (isCanvasVisible) return undefined;

    hideCanvas();

    return () => {
      showCanvas();
    };
  }, [isCanvasVisible]);

  useTeardown(() => {
    engine()?.teardown();
  });

  const isPrototypeDisplay = prototypeMode === Prototype.PrototypeMode.DISPLAY;
  const isPrototypeDeveloper = prototypeMode === Prototype.PrototypeMode.DEVELOPER;

  const getPrototypeSettingsWidth = () => {
    if (isPrototypeDisplay) {
      return theme.components.displaySettings.width;
    }

    if (isPrototypeDeveloper) {
      return theme.components.developerSettings.width;
    }

    return widthRef.current;
  };

  widthRef.current = getPrototypeSettingsWidth();

  const isPrototypeSettingsOpened = isPrototypeDisplay || isPrototypeDeveloper;

  return (
    <>
      {isCanvasEditable && <DiagramSync diagramID={diagramID} />}

      <ManagerProvider value={getManager as any}>
        {!isDesignMode && <TopPrompt />}

        <ReadOnlyBadge />

        {/* always render the canvas, hide with CSS */}
        <Canvas />

        {!isPrototypingMode && <CanvasControls render={!canvasOnly} />}

        {/* design mode */}
        {isDesignMode && (
          <>
            <DesignMenu />
            <FlowControls render={!canvasOnly} />
          </>
        )}

        {/* markup mode */}
        {isMarkupMode && (
          <>
            <MarkupMenu />
            <MarkupImageLoading />
          </>
        )}

        {/* prototyping mode */}
        <PrototypeSidebar open={isPrototypingMode} />
        <PrototypeMenu open={isPrototypingMode} />

        {isPrototypingMode && (
          <>
            {isPrototypeDisplay && <PrototypeVisualCanvas />}

            <Drawer
              as="section"
              open={isPrototypeSettingsOpened}
              width={widthRef.current}
              offset={theme.components.subMenu.width}
              direction={SlideOutDirection.RIGHT}
            >
              {isPrototypeDeveloper && <PrototypeDeveloperSettings />}
              {isPrototypeDisplay && <PrototypeDisplaySettings />}
            </Drawer>
          </>
        )}

        {canvasOnly && <RemoveIntercom />}
      </ManagerProvider>
    </>
  );
};

const mapStateToProps = {
  canvasOnly: UI.isCanvasOnlyShowingSelector,
  prototypeMode: Prototype.activePrototypeModeSelector,
};

const mapDispatchToProps = {
  hideCanvas: Creator.hideCanvas,
  showCanvas: Creator.showCanvas,
};

type ConnectedDiagramProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Diagram) as React.FC<DiagramProps>;
