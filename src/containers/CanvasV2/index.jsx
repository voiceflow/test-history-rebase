import React from 'react';

import DefaultModal from '@/components/Modal/DefaultModal';
import ShortCuts from '@/components/ShortCuts/ShortCuts';
import IntentsModal from '@/containers/CanvasV2/components/IntentsModal';
import SlotEditModal from '@/containers/CanvasV2/components/SlotEdit/SlotEditModal';
import DisplayPreviewModal from '@/containers/CanvasV2/managers/Display/components/PreviewModal';
import HelpModal from '@/containers/Help';
import SettingsModal from '@/containers/Settings';
import { SettingsModalConsumer } from '@/containers/Settings/contexts';
import { DiagramLoadingGate } from '@/gates';
import { withBatchLoadingGate } from '@/hocs';
import { compose } from '@/utils/functional';

import Container from './components/CanvasContainer';
import CanvasDiagram from './components/CanvasDiagram';
import CanvasNotifications from './components/CanvasNotifications';
import ContextMenu from './components/ContextMenu';
import EditSidebar from './components/EditSidebar';
import RealtimeOverlay from './components/RealtimeOverlay';
import Spotlight from './components/Spotlight';
import { CanvasProviders, HelpModalConsumer, ShortcutModalConsumer } from './contexts';
import useEngine from './engine';

const Canvas = ({ isTesting }) => {
  const { engine, isFinalized } = useEngine();

  React.useEffect(() => {
    if (engine.getRootNodeIDs().length === 1) {
      engine.focusHome();
    }
  }, [engine]);

  return (
    <CanvasProviders engine={engine} isTesting={isTesting}>
      <Container>
        <ContextMenu />
        <CanvasDiagram renderLinks={isFinalized} />
        <RealtimeOverlay />
        <EditSidebar />
        <Spotlight />
      </Container>

      <HelpModalConsumer>{({ isEnabled, toggle, type }) => <HelpModal open={isEnabled} help={{ type }} toggle={toggle} />}</HelpModalConsumer>

      <ShortcutModalConsumer>
        {({ isEnabled, toggle }) => <DefaultModal open={isEnabled} header="Keyboard Shortcuts" toggle={toggle} content={<ShortCuts />} />}
      </ShortcutModalConsumer>

      <DisplayPreviewModal />

      <SlotEditModal />
      <IntentsModal />
      <SettingsModalConsumer>
        {({ isEnabled, toggle, type, setType }) => <SettingsModal open={isEnabled} type={type} toggle={toggle} setType={setType} />}
      </SettingsModalConsumer>

      <CanvasNotifications />
    </CanvasProviders>
  );
};

export default compose(
  React.memo,
  withBatchLoadingGate(DiagramLoadingGate)
)(Canvas);
