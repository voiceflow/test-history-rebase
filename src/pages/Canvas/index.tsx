import React from 'react';

import { DiagramLoadingGate } from '@/gates';
import { withLoadingGate } from '@/hocs';
import { useSetup } from '@/hooks';
import { BulkImportSlots, BulkImportUtterances } from '@/pages/Canvas/components/BulkImportModal';
import InteractionModelModal from '@/pages/Canvas/components/InteractionModelModal';
import ShortcutsModal from '@/pages/Canvas/components/ShortcutsModal';
import SlotEditModal from '@/pages/Canvas/components/SlotEdit/SlotEditModal';
import DisplayPreviewModal from '@/pages/Canvas/managers/Display/components/PreviewModal';
import { compose } from '@/utils/functional';

import Container from './components/CanvasContainer';
import CanvasDiagram from './components/CanvasDiagram';
import ContextMenu from './components/ContextMenu';
import EditSidebar from './components/EditorSidebar';
import RealtimeOverlay from './components/RealtimeOverlay';
import Spotlight from './components/Spotlight';
import ThreadHistoryDrawer from './components/ThreadHistoryDrawer';
import ThreadLayer from './components/ThreadLayer';
import { CanvasAction } from './constants';
import { CanvasProviders } from './contexts';
import useEngine from './engine';

const Canvas: React.FC = () => {
  const engine = useEngine();

  React.useEffect(() => {
    if (engine.getRootNodeIDs().length === 1 && !engine.comment.isActive) {
      engine.focusHome();
    }
  }, [engine]);

  useSetup(() => engine.emitter.emit(CanvasAction.RENDERED));

  return (
    <CanvasProviders engine={engine}>
      <Container>
        <ContextMenu />
        <CanvasDiagram />
        <RealtimeOverlay />
        <EditSidebar />
        <Spotlight />
        <ThreadLayer />
        <ThreadHistoryDrawer />
      </Container>

      <ShortcutsModal />
      <DisplayPreviewModal />
      <SlotEditModal />
      <BulkImportSlots />
      <BulkImportUtterances />
      <InteractionModelModal />
    </CanvasProviders>
  );
};

export default compose(React.memo, withLoadingGate(DiagramLoadingGate))(Canvas);
