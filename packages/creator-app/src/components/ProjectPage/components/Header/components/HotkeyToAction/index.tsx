import React from 'react';

import { useHotKeys } from '@/hooks';
import { Hotkey, HOTKEY_LABEL_MAP } from '@/keymap';

import { Container, KeyBubble } from './components';

interface HotkeyToActionProps {
  id?: string;
  label: string;
  hotkey: Hotkey;
  onHotkey: (event: KeyboardEvent | React.MouseEvent) => void;
  preventDefault?: boolean;
}

const HotkeyToAction: React.FC<HotkeyToActionProps> = ({ id, label, hotkey, onHotkey, preventDefault }) => {
  useHotKeys(hotkey, onHotkey, { preventDefault }, [onHotkey]);

  return (
    <Container id={id} onClick={onHotkey}>
      <KeyBubble>{HOTKEY_LABEL_MAP[hotkey]}</KeyBubble>
      <div>{label}</div>
    </Container>
  );
};

export default HotkeyToAction;
