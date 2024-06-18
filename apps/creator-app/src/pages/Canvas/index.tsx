import { compose } from '@voiceflow/ui';
import React from 'react';
import { useHistory } from 'react-router-dom';

import { Path } from '@/config/routes';
import * as CreatorV2 from '@/ducks/creatorV2/utils/selector';
import { withBatchLoadingGate } from '@/hocs/withBatchLoadingGate';
import { useRegistration, useTeardown } from '@/hooks';
import { DiagramHeartbeatContext, SelectionSetTargetsContext } from '@/pages/Project/contexts';
import { matchPath } from '@/utils/route.util';

import Container from './components/CanvasContainer';
import CanvasDiagram from './components/CanvasDiagram';
import ContextMenu from './components/ContextMenu';
import DisableOverscrollBehavior from './components/DisableOverscrollBehavior';
import EditorSidebar from './components/EditorSidebar';
import EmptyViewportSnackbar from './components/EmptyViewportSnackbar';
import RealtimeOverlay from './components/RealtimeOverlay';
import Search from './components/Search';
import Spotlight from './components/Spotlight';
import ThreadHistoryDrawer from './components/ThreadHistoryDrawer';
import ThreadLayer from './components/ThreadLayer';
import ToManyBlocksSnackbar from './components/ToManyBlocksSnackbar';
import { CanvasProviders } from './contexts';
import { DiagramSubscriptionGate } from './gates/DiagramSubscription.gate';
import { useEngine, useIO } from './hooks';
import { useTokenToastNotification } from './hooks/notification';

interface CanvasProps {
  isPrototypingMode?: boolean;
}

const Canvas: React.FC<CanvasProps> = ({ isPrototypingMode }) => {
  useTokenToastNotification();
  const [engine, engineKey] = useEngine();

  // using history to do not rerender on the every location change
  const history = useHistory();

  const diagramHeartbeatContext = React.useContext(DiagramHeartbeatContext);
  const selectionSetTargetsContext = React.useContext(SelectionSetTargetsContext);

  React.useEffect(() => {
    const nodeMatch = matchPath(history.location.pathname, Path.CANVAS_NODE);

    // This timeout is needed to prevent the focusNode from being called before the canvas is ready causing lines to not be drawn
    const focusTimeout = window.setTimeout(() => {
      const nodeID = nodeMatch?.params.nodeID;
      const rootNodes = engine.getRootNodeIDs();
      const allNodeIDs = engine.getAllNodeIDs();

      // TODO: play with the number, probably needs to read user's available memory and adjust number based on the memory
      const animated = allNodeIDs.length < 1000;

      if (nodeID && engine.context.diagramID === nodeMatch.params.diagramID) {
        if (nodeID === 'start') {
          engine.focusHome({ open: true, animated, skipURLSync: true });
        } else {
          engine.focusNode(nodeID, { open: true, animated, skipURLSync: true });
        }
      } else if (rootNodes.length === 1 && !engine.comment.isModeActive) {
        engine.centerNode(rootNodes[0], { animated });
      }
    }, 100);

    return () => {
      clearTimeout(focusTimeout);
    };
  }, [engine]);

  useIO(engine);

  useRegistration(
    () => engine.register('diagramHeartbeat', diagramHeartbeatContext),
    [engine, diagramHeartbeatContext]
  );
  useRegistration(
    () => engine.selection.register('selectionSetTargetsContext', selectionSetTargetsContext),
    [engine, selectionSetTargetsContext]
  );

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
            <EditorSidebar />
            <Spotlight />
            <Search />
            <ThreadHistoryDrawer />
            <ToManyBlocksSnackbar />
            <EmptyViewportSnackbar />
          </>
        )}
      </Container>
    </CanvasProviders>
  );
};

export default compose(React.memo, withBatchLoadingGate(DiagramSubscriptionGate))(Canvas) as React.FC<CanvasProps>;
