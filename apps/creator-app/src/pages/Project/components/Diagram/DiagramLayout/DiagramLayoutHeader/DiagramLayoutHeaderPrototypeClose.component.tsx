import { Header, TooltipWithKeys, useTooltipModifiers } from '@voiceflow/ui-next';
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
  const modifiers = useTooltipModifiers([{ name: 'offset', options: { offset: [0, 11] } }]);
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
      text="Exit"
      hotkeys={[{ label: getHotkeyLabel(Hotkey.CLOSE_CANVAS_MODE) }]}
      modifiers={modifiers}
      placement="bottom"
      referenceElement={({ ref, onOpen, onClose }) => (
        <Header.Button.Primary
          ref={ref}
          label="Exit"
          onClick={() => goToCurrentCanvas()}
          iconName="CloseM"
          onMouseEnter={onOpen}
          onMouseLeave={onClose}
        />
      )}
    />
  );
};
