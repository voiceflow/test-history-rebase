import { Header, TooltipWithKeys } from '@voiceflow/ui-next';
import React, { useContext } from 'react';

import { PrototypeStatus } from '@/constants/prototype';
import { Router } from '@/ducks';
import { useHotkey } from '@/hooks/hotkeys';
import { useUnmount } from '@/hooks/lifecircle.hook';
import { useDispatch } from '@/hooks/store.hook';
import { useTrackingEvents } from '@/hooks/tracking';
import { getHotkeyLabel, Hotkey } from '@/keymap';
import { PrototypeContext } from '@/pages/Prototype/context';

export const DiagramLayoutHeaderPrototypeClose: React.FC = () => {
  const prototype = useContext(PrototypeContext);
  const [trackingEvents] = useTrackingEvents();

  const goToCurrentCanvas = useDispatch(Router.goToCurrentCanvas);

  useHotkey(Hotkey.CLOSE_CANVAS_MODE, () => goToCurrentCanvas());

  useUnmount(() => {
    if (prototype.state.status === PrototypeStatus.ACTIVE) {
      trackingEvents.trackProjectPrototypeEnd();
    }
  });

  return (
    <TooltipWithKeys
      text="Close"
      hotkeys={[{ label: getHotkeyLabel(Hotkey.CLOSE_CANVAS_MODE) }]}
      placement="bottom"
      referenceElement={({ ref, onOpen, onClose }) => (
        <div ref={ref}>
          <Header.Button.Primary label="Close" iconName="CloseM" onClick={() => goToCurrentCanvas()} onMouseEnter={onOpen} onMouseLeave={onClose} />
        </div>
      )}
    />
  );
};
