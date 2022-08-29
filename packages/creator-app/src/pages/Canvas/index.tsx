import React from 'react';
import { matchPath, useHistory } from 'react-router-dom';

import { Path } from '@/config/routes';
import * as CreatorV2 from '@/ducks/creatorV2/utils/selector';
import { DiagramSubscriptionGate } from '@/gates';
import { compose, withBatchLoadingGate } from '@/hocs';
import { useRAF, useRegistration, useTeardown } from '@/hooks';
import { DiagramHeartbeatContext, SelectionSetTargetsContext } from '@/pages/Project/contexts';
import * as Query from '@/utils/query';

import APLPreviewModal from './components/APLPreviewModal';
import Container from './components/CanvasContainer';
import CanvasDiagram from './components/CanvasDiagram';
import ContextMenu from './components/ContextMenu';
import DisableOverscrollBehavior from './components/DisableOverscrollBehavior';
import EditSidebar from './components/EditorSidebar';
import ExportModelModal from './components/ExportModelModal';
import NLUQuickView from './components/NLUQuickView';
import RealtimeOverlay from './components/RealtimeOverlay';
import Search from './components/Search';
import ShortcutsModal from './components/ShortcutsModal';
import SlotEditModal from './components/SlotEdit/SlotEditModal';
import Spotlight from './components/Spotlight';
import ThreadHistoryDrawer from './components/ThreadHistoryDrawer';
import ThreadLayer from './components/ThreadLayer';
import { CanvasProviders } from './contexts';
import { useEngine, useIO } from './hooks';

interface CanvasProps {
  isPrototypingMode?: boolean;
}

const Canvas: React.FC<CanvasProps> = ({ isPrototypingMode }) => {
  const [engine, engineKey] = useEngine();

  // using history to do not rerender on the every location change
  const history = useHistory();
  const [scheduler, schedulerAPI] = useRAF();

  const diagramHeartbeatContext = React.useContext(DiagramHeartbeatContext);
  const selectionSetTargetsContext = React.useContext(SelectionSetTargetsContext);

  React.useEffect(() => {
    const nodeMatch = matchPath<{ nodeID: string }>(history.location.pathname, { path: Path.CANVAS_NODE });
    const rootNodes = engine.getRootNodeIDs();
    const query = Query.parse(history.location.search);

    scheduler(() => {
      const nodeID = nodeMatch?.params.nodeID ?? query.nodeID;

      if (nodeID) {
        const isPrototype = engine.prototype.isActive;

        if (query.nodeID) {
          history.push({ search: '' });
        }

        if (nodeID === 'start') {
          engine.focusStart({ open: !isPrototype, skipURLSync: !!nodeMatch?.params.nodeID || isPrototype });
        } else {
          engine.focusNode(nodeID, { open: !isPrototype, skipURLSync: !!nodeMatch?.params.nodeID || isPrototype });
        }
      } else if (rootNodes.length === 1 && !engine.comment.isModeActive) {
        engine.centerNode(rootNodes[0]);
      }
    });

    return schedulerAPI.current.cancel;
  }, [engine]);

  useIO(engine);

  useRegistration(() => engine.register('diagramHeartbeat', diagramHeartbeatContext), [engine, diagramHeartbeatContext]);
  useRegistration(() => engine.selection.register('selectionSetTargetsContext', selectionSetTargetsContext), [engine, selectionSetTargetsContext]);

  useTeardown(() => CreatorV2.clearAllCache());

  return (
    <CanvasProviders key={engineKey} engine={engine}>
      <Container>
        <DisableOverscrollBehavior />
        <ContextMenu />

        <CanvasDiagram>
          {!isPrototypingMode && (
            <>
              <ThreadLayer />
            </>
          )}
        </CanvasDiagram>

        <RealtimeOverlay />

        {!isPrototypingMode && (
          <>
            <EditSidebar />
            <Spotlight />
            <Search />
            <ThreadHistoryDrawer />
          </>
        )}
      </Container>

      <NLUQuickView />
      <ShortcutsModal />
      <APLPreviewModal />
      <SlotEditModal />
      <ExportModelModal />
    </CanvasProviders>
  );
};

export default compose(React.memo, withBatchLoadingGate(DiagramSubscriptionGate))(Canvas) as React.FC<CanvasProps>;
