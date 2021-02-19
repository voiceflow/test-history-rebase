import React from 'react';

import { DiagramLoadingGate } from '@/gates';
import { withLoadingGate } from '@/hocs';
import { useDidUpdateEffect, useTheme } from '@/hooks';
import APLPreviewModal from '@/pages/Canvas/components/APLPreviewModal';
import { BulkImportSlots, BulkImportUtterances } from '@/pages/Canvas/components/BulkImportModal';
import InteractionModelModal from '@/pages/Canvas/components/InteractionModelModal';
import ShortcutsModal from '@/pages/Canvas/components/ShortcutsModal';
import SlotEditModal from '@/pages/Canvas/components/SlotEdit/SlotEditModal';
import { compose } from '@/utils/functional';

import Container from './components/CanvasContainer';
import CanvasDiagram from './components/CanvasDiagram';
import ContextMenu from './components/ContextMenu';
import EditSidebar from './components/EditorSidebar';
import RealtimeOverlay from './components/RealtimeOverlay';
import Spotlight from './components/Spotlight';
import ThreadHistoryDrawer from './components/ThreadHistoryDrawer';
import ThreadLayer from './components/ThreadLayer';
import { CanvasProviders } from './contexts';
import useEngine from './engine';

type CanvasProps = {
  isPrototypingMode?: boolean;
};

const Canvas: React.FC<CanvasProps> = ({ isPrototypingMode }) => {
  const engine = useEngine();
  const theme = useTheme();

  React.useEffect(() => {
    if (engine.getRootNodeIDs().length === 1 && !engine.comment.isActive) {
      engine.focusHome();
    }
  }, [engine]);

  useDidUpdateEffect(() => {
    const position = engine.canvas?.getPosition();
    const { height } = theme.components.subHeader;

    if (position) {
      engine.canvas?.setPosition([position[0], position[1] + (isPrototypingMode ? height : -height)]);
    }
  }, [isPrototypingMode]);

  return (
    <CanvasProviders engine={engine}>
      <Container>
        <ContextMenu />
        <CanvasDiagram />
        <RealtimeOverlay />

        {!isPrototypingMode && (
          <>
            <EditSidebar />
            <Spotlight />
            <ThreadLayer />
            <ThreadHistoryDrawer />
          </>
        )}
      </Container>

      <ShortcutsModal />
      <APLPreviewModal />
      <SlotEditModal />
      <BulkImportSlots />
      <BulkImportUtterances />
      <InteractionModelModal />
    </CanvasProviders>
  );
};

export default compose(React.memo, withLoadingGate(DiagramLoadingGate))(Canvas) as React.FC<CanvasProps>;
