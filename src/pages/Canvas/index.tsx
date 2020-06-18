import React from 'react';

import { DiagramLoadingGate } from '@/gates';
import { withBatchLoadingGate } from '@/hocs';
import { BulkImportSlots, BulkImportUtterances } from '@/pages/Canvas/components/BulkImportModal';
import IntentsModal from '@/pages/Canvas/components/IntentsModal';
import InteractionModelModal from '@/pages/Canvas/components/InteractionModelModal';
import ShortcutsModal from '@/pages/Canvas/components/ShortcutsModal';
import SlotEditModal from '@/pages/Canvas/components/SlotEdit/SlotEditModal';
import DisplayPreviewModal from '@/pages/Canvas/managers/Display/components/PreviewModal';
import SettingsModal from '@/pages/Settings';
import { SettingsModalConsumer } from '@/pages/Settings/contexts';
import { compose } from '@/utils/functional';

import Container from './components/CanvasContainer';
import CanvasDiagram from './components/CanvasDiagram';
import CanvasNotifications from './components/CanvasNotifications';
import ContextMenu from './components/ContextMenu';
import EditSidebar from './components/EditorSidebar';
import RealtimeOverlay from './components/RealtimeOverlay';
import Spotlight from './components/Spotlight';
import { CanvasProviders } from './contexts';
import useEngine from './engine';

const Canvas: React.FC = () => {
  const engine = useEngine();

  React.useEffect(() => {
    if (engine.getRootNodeIDs().length === 1) {
      engine.focusHome();
    }
  }, [engine]);

  return (
    <CanvasProviders engine={engine}>
      <Container>
        <ContextMenu />
        <CanvasDiagram />
        <RealtimeOverlay />
        <EditSidebar />
        <Spotlight />
      </Container>

      <ShortcutsModal />
      <DisplayPreviewModal />
      <SlotEditModal />
      <IntentsModal />
      <BulkImportSlots />
      <BulkImportUtterances />
      <InteractionModelModal />

      <SettingsModalConsumer>
        {(modal) => <SettingsModal open={modal?.isEnabled} type={modal?.type} toggle={modal?.toggle} setType={modal?.setType} />}
      </SettingsModalConsumer>

      <CanvasNotifications />
    </CanvasProviders>
  );
};

export default compose(React.memo, withBatchLoadingGate(DiagramLoadingGate))(Canvas);
