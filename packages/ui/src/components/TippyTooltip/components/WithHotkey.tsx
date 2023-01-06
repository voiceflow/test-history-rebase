import React from 'react';

import HotkeyLabel from './HotkeyLabel';

export interface WithHotkeyProps {
  hotkey?: React.ReactNode;
  children?: React.ReactNode;
}

const WithHotkey: React.FC<WithHotkeyProps> = ({ hotkey, children }) => (
  <>
    {children}

    {hotkey && <HotkeyLabel>{hotkey}</HotkeyLabel>}
  </>
);

export default WithHotkey;
