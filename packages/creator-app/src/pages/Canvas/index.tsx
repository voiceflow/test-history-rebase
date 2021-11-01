import React from 'react';
import { useHistory } from 'react-router-dom';

import { FeatureFlag } from '@/config/features';
import { DiagramLoadingGate } from '@/gates';
import { withLoadingGate } from '@/hocs';
import { useFeature, useRegistration } from '@/hooks';
import APLPreviewModal from '@/pages/Canvas/components/APLPreviewModal';
import { BulkImportSlots, BulkImportUtterances } from '@/pages/Canvas/components/BulkImportModal';
import ExportModelModal from '@/pages/Canvas/components/ExportModelModal';
import InteractionModelModal from '@/pages/Canvas/components/InteractionModelModal';
import ShortcutsModal from '@/pages/Canvas/components/ShortcutsModal';
import SlotEditModal from '@/pages/Canvas/components/SlotEdit/SlotEditModal';
import { SelectionSetTargetsContext } from '@/pages/Skill/contexts';
import { compose } from '@/utils/functional';
import * as Query from '@/utils/query';

import Container from './components/CanvasContainer';
import CanvasDiagram from './components/CanvasDiagram';
import ContextMenu from './components/ContextMenu';
import EditSidebar from './components/EditorSidebar';
import ManualSaveModal from './components/ManualSaveModal';
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
  const projectVersionsEnabled = useFeature(FeatureFlag.PROJECT_VERSIONS)?.isEnabled;

  // using history to do not rerender on the every location change
  const history = useHistory();

  const selectionSetTargetsContext = React.useContext(SelectionSetTargetsContext);

  React.useEffect(() => {
    const { nodeID } = Query.parse(history.location.search);
    const rootNodes = engine.getRootNodeIDs();

    const frame = requestAnimationFrame(() => {
      if (nodeID) {
        history.push({ search: '' });

        if (nodeID === 'start') {
          engine.focusHome({ open: true });
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

      <ShortcutsModal />
      <APLPreviewModal />
      <SlotEditModal />
      <BulkImportSlots />
      <BulkImportUtterances />
      <InteractionModelModal />
      <ExportModelModal />
      {projectVersionsEnabled && <ManualSaveModal />}
    </CanvasProviders>
  );
};

export default compose(React.memo, withLoadingGate(DiagramLoadingGate))(Canvas) as React.FC<CanvasProps>;
