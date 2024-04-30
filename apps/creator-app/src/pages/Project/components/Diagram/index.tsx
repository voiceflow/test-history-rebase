import { FeatureFlag } from '@voiceflow/realtime-sdk';
import { useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';

import * as UI from '@/ducks/ui';
import { withBatchLoadingGate } from '@/hocs/withBatchLoadingGate';
import { useDispatch, useEventualEngine, useLayoutDidUpdate, useSelector, useTeardown, useTheme } from '@/hooks';
import { useFeature } from '@/hooks/feature';
import Canvas from '@/pages/Canvas';
import { ManagerProvider } from '@/pages/Canvas/contexts';
import { useManager } from '@/pages/Canvas/managers/utils';
import DesignMenu from '@/pages/Project/components/DesignMenu';
import ProjectPage from '@/pages/Project/components/ProjectPage';
import TestVariablesSidebar from '@/pages/Project/components/Sidebar/components/TestVariablesSidebar';
import { useAnyModeOpen, usePrototypingMode } from '@/pages/Project/hooks';
import PrototypeOverlay from '@/pages/Prototype/components/PrototypeOverlay';
import ReadOnlyBadge from '@/pages/Prototype/components/ReadOnlyBadge';

import DiagramSync from '../DiagramSync';
import DomainSync from '../DomainSync';
import MarkupImageLoading from '../MarkupImageLoading';
import { DiagramHotkeys } from './DiagramHotkeys.component';
import { DiagramLayout } from './DiagramLayout/DiagramLayout.component';
import { DiagramSidebar } from './DiagramSidebar/DiagramSidebar.component';
import DiagramGate from './gates/DiagramGate';

const Diagram: React.FC = () => {
  const theme = useTheme();
  const getEngine = useEventualEngine();
  const cmsWorkflows = useFeature(FeatureFlag.CMS_WORKFLOWS);

  const canvasOnly = useSelector(UI.selectors.isCanvasOnly);

  const toggleCanvasOnly = useDispatch(UI.action.ToggleCanvasOnly);

  const engine = useEventualEngine();
  const getManager = useManager();
  const isDesignMode = !useAnyModeOpen();
  const isPrototypingMode = usePrototypingMode();

  const isCanvasEditable = !isPrototypingMode;

  useDidUpdateEffect(() => {
    if (!isDesignMode && canvasOnly) {
      toggleCanvasOnly();
    }
  }, [isDesignMode]);

  useLayoutDidUpdate(() => {
    if (cmsWorkflows.isEnabled) return;

    const engine = getEngine();

    const position = engine?.canvas?.getPosition();
    const { height } = theme.components.page.header;

    if (position) {
      engine?.canvas?.setPosition([position[0], position[1] + (canvasOnly ? height : -height)]);
    }
  }, [canvasOnly, cmsWorkflows.isEnabled]);

  useTeardown(() => {
    engine()?.teardown();

    if (canvasOnly) {
      toggleCanvasOnly();
    }
  }, [canvasOnly]);

  const Container = cmsWorkflows.isEnabled ? DiagramLayout : ProjectPage;

  return (
    <Container>
      {isCanvasEditable && (
        <>
          <DiagramSync />
          {!cmsWorkflows.isEnabled && <DomainSync />}
        </>
      )}

      <ManagerProvider value={getManager}>
        <ReadOnlyBadge />

        {/* always render the canvas, hide with CSS */}
        <Canvas isPrototypingMode={isPrototypingMode} />

        {!isPrototypingMode && <DiagramHotkeys />}

        {/* design mode */}

        {cmsWorkflows.isEnabled ? (
          <>
            {isPrototypingMode ? (
              <TestVariablesSidebar />
            ) : (
              <>
                <DiagramSidebar />
                <MarkupImageLoading />
              </>
            )}
          </>
        ) : (
          isDesignMode && (
            <>
              <DesignMenu canvasOnly={canvasOnly} />
              <MarkupImageLoading />
            </>
          )
        )}

        <PrototypeOverlay />
      </ManagerProvider>
    </Container>
  );
};

export default withBatchLoadingGate(DiagramGate)(Diagram);
