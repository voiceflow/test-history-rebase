import React from 'react';

import DefaultModal from '@/components/LegacyModal/DefaultModal';
import ShortCuts from '@/components/ShortCuts/ShortCuts';
import { DiagramLoadingGate } from '@/gates';
import { withBatchLoadingGate } from '@/hocs';
import IntentsModal from '@/pages/Canvas/components/IntentsModal';
import SlotEditModal from '@/pages/Canvas/components/SlotEdit/SlotEditModal';
import DisplayPreviewModal from '@/pages/Canvas/managers/Display/components/PreviewModal';
import HelpModal from '@/pages/Help';
import SettingsModal from '@/pages/Settings';
import { SettingsModalConsumer } from '@/pages/Settings/contexts';
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

export default compose(React.memo, withBatchLoadingGate(DiagramLoadingGate))(Canvas);
