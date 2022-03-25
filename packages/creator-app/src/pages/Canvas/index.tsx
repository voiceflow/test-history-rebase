import React from 'react';
import { useHistory } from 'react-router-dom';

import { FeatureFlag } from '@/config/features';
import { DiagramLoadingGate } from '@/gates';
import { compose, withBatchLoadingGate } from '@/hocs';
import { useFeature, useRegistration } from '@/hooks';
import APLPreviewModal from '@/pages/Canvas/components/APLPreviewModal';
import { BulkImportSlots, BulkImportUtterances } from '@/pages/Canvas/components/BulkImportModal';
import CreateEntityModal from '@/pages/Canvas/components/EntityModalsV2/CreateModal';
import EditEntityModal from '@/pages/Canvas/components/EntityModalsV2/EditModal';
import ExportModelModal from '@/pages/Canvas/components/ExportModelModal';
import EditIntentModal from '@/pages/Canvas/components/IntentModalsV2/EditModal';
import InteractionModelModal from '@/pages/Canvas/components/InteractionModelModal';
import NLUQuickView from '@/pages/Canvas/components/NLUQuickView';
import ShortcutsModal from '@/pages/Canvas/components/ShortcutsModal';
import SlotEditModal from '@/pages/Canvas/components/SlotEdit/SlotEditModal';
import CreateVariableModal from '@/pages/Canvas/components/VariableModalsV2/CreateModal';
import { SelectionSetTargetsContext } from '@/pages/Project/contexts';
import * as Query from '@/utils/query';

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

interface CanvasProps {
  isPrototypingMode?: boolean;
}

const Canvas: React.FC<CanvasProps> = ({ isPrototypingMode }) => {
  const engine = useEngine();
  // using history to do not rerender on the every location change
  const history = useHistory();

  const IMM_MODALS_V2 = useFeature(FeatureFlag.IMM_MODALS_V2);

  const selectionSetTargetsContext = React.useContext(SelectionSetTargetsContext);

  React.useEffect(() => {
    const { nodeID } = Query.parse(history.location.search);
    const rootNodes = engine.getRootNodeIDs();

    const frame = requestAnimationFrame(() => {
      if (nodeID) {
        history.push({ search: '' });

        if (nodeID === 'start') {
          engine.focusStart({ open: true });
        } else {
          engine.focusNode(nodeID, { open: true });
        }
      } else if (rootNodes.length === 1 && !engine.comment.isActive) {
        engine.centerNode(rootNodes[0]);
      }
    });

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [engine]);

  useRegistration(() => engine.selection.register('selectionSetTargetsContext', selectionSetTargetsContext), [selectionSetTargetsContext]);

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

      <EditIntentModal />
      <CreateVariableModal />

      <CreateEntityModal />
      <EditEntityModal />

      {IMM_MODALS_V2.isEnabled ? <NLUQuickView /> : <InteractionModelModal />}

      <ShortcutsModal />
      <APLPreviewModal />
      <SlotEditModal />
      <BulkImportSlots />
      <BulkImportUtterances />
      <ExportModelModal />
    </CanvasProviders>
  );
};

export default compose(React.memo, withBatchLoadingGate(DiagramLoadingGate))(Canvas) as React.FC<CanvasProps>;
