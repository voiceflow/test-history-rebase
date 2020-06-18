import React from 'react';

import ShortcutContainer from './ShortcutContainer';
import ShortcutTitle from './ShortcutTitle';

export type ShortcutProps = {
  title: string;
  command: React.ReactNode;
};

const Shortcut: React.FC<ShortcutProps> = ({ command, title }) => (
  <ShortcutContainer>
    <ShortcutTitle>{title}</ShortcutTitle>

    <div>{command}</div>
  </ShortcutContainer>
);

export default Shortcut;
