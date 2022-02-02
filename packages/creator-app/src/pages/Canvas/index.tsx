import React from 'react';
import { useHistory } from 'react-router-dom';

import * as Creator from '@/ducks/creator';
import * as Session from '@/ducks/session';
import { DiagramLoadingGate } from '@/gates';
import { compose, withLoadingGate } from '@/hocs';
import { useDispatch, useRegistration, useSelector } from '@/hooks';
import APLPreviewModal from '@/pages/Canvas/components/APLPreviewModal';
import { BulkImportSlots, BulkImportUtterances } from '@/pages/Canvas/components/BulkImportModal';
import ExportModelModal from '@/pages/Canvas/components/ExportModelModal';
import InteractionModelModal from '@/pages/Canvas/components/InteractionModelModal';
import ShortcutsModal from '@/pages/Canvas/components/ShortcutsModal';
import SlotEditModal from '@/pages/Canvas/components/SlotEdit/SlotEditModal';
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

  const activeDiagramID = useSelector(Session.activeDiagramIDSelector);
  const creatorDiagramID = useSelector(Creator.creatorDiagramIDSelector);
  const loadDiagram = useDispatch(Creator.initializeCreatorForActiveDiagram);
  const isLoaded = creatorDiagramID === activeDiagramID;

  // using history to do not rerender on the every location change
  const history = useHistory();

  const selectionSetTargetsContext = React.useContext(SelectionSetTargetsContext);

  React.useEffect(() => {
    if (!isLoaded) {
      loadDiagram();
    }
  }, [isLoaded]);

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
        <CanvasDiagram key={creatorDiagramID} />
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
    </CanvasProviders>
  );
};

export default compose(React.memo, withLoadingGate(DiagramLoadingGate))(Canvas) as React.FC<CanvasProps>;
