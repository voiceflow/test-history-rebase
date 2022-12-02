import React from 'react';

import { useHotKeys } from '@/hooks';
import { Hotkey, HOTKEY_LABEL_MAP } from '@/keymap';

import * as S from './styles';

interface HotkeyToActionProps {
  id?: string;
  label: string;
  hotkey: Hotkey;
  onHotkey: (event: KeyboardEvent | React.MouseEvent) => void;
  disabled?: boolean;
  preventDefault?: boolean;
}

const HotkeyToAction: React.FC<HotkeyToActionProps> = ({ id, label, hotkey, onHotkey, preventDefault, disabled }) => {
  useHotKeys(hotkey, onHotkey, { preventDefault, disable: disabled }, [onHotkey]);

  return (
    <S.Container id={id} onClick={onHotkey}>
      <S.KeyBubble>{HOTKEY_LABEL_MAP[hotkey]}</S.KeyBubble>
      <div>{label}</div>
    </S.Container>
  );
};

export default HotkeyToAction;
