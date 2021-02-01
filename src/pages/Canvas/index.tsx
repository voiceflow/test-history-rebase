import React from 'react';

import * as Prototype from '@/ducks/prototype';
import { DiagramLoadingGate } from '@/gates';
import { connect } from '@/hocs';
import { useDidUpdateEffect, useSetup } from '@/hooks';
import { BulkImportSlots, BulkImportUtterances } from '@/pages/Canvas/components/BulkImportModal';
import InteractionModelModal from '@/pages/Canvas/components/InteractionModelModal';
import ShortcutsModal from '@/pages/Canvas/components/ShortcutsModal';
import SlotEditModal from '@/pages/Canvas/components/SlotEdit/SlotEditModal';
import DisplayPreviewModal from '@/pages/Canvas/managers/Display/components/PreviewModal';
import THEME from '@/styles/theme';
import { ConnectedProps } from '@/types';

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

type CanvasProps = {
  isPrototypingMode?: boolean;
};

const Canvas: React.FC<CanvasProps & CanvasConnectedProps> = ({ prototypeMode, isPrototypingMode }) => {
  const engine = useEngine();

  React.useEffect(() => {
    if (engine.getRootNodeIDs().length === 1 && !engine.comment.isActive) {
      engine.focusHome();
    }
  }, [engine]);

  useDidUpdateEffect(() => {
    const position = engine.canvas?.getPosition();
    const { height } = THEME.components.subHeader;

    if (position) {
      engine.canvas?.setPosition([position[0], position[1] + (isPrototypingMode ? height : -height)]);
    }
  }, [isPrototypingMode]);

  useSetup(() => engine.emitter.emit(CanvasAction.RENDERED));

  return (
    <DiagramLoadingGate withoutSpinner={prototypeMode === Prototype.PrototypeMode.DISPLAY}>
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
    </DiagramLoadingGate>
  );
};

const mapStateToProps = {
  prototypeMode: Prototype.activePrototypeModeSelector,
};

type CanvasConnectedProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(Canvas) as React.FC<CanvasProps>;
