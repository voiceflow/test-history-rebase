import React from 'react';

import { isMac } from '@/config';

import { ShortcutCommand } from './components';

const hotKey = isMac ? '⌘' : 'Ctrl';

// eslint-disable-next-line import/prefer-default-export
export const SHORTCUTS = [
  {
    title: 'Copy',
    command: (
      <>
        <ShortcutCommand>{hotKey}</ShortcutCommand> + <ShortcutCommand>C</ShortcutCommand>
      </>
    ),
  },
  {
    title: 'Paste',
    command: (
      <>
        <ShortcutCommand>{hotKey}</ShortcutCommand> + <ShortcutCommand>V</ShortcutCommand>
      </>
    ),
  },
  {
    title: 'Duplicate',
    command: (
      <>
        <ShortcutCommand>{hotKey}</ShortcutCommand> + <ShortcutCommand>D</ShortcutCommand>
      </>
    ),
  },
  {
    title: 'Undo',
    command: (
      <>
        <ShortcutCommand>{hotKey}</ShortcutCommand> + <ShortcutCommand>Z</ShortcutCommand>
      </>
    ),
  },
  {
    title: 'Redo',
    command: (
      <>
        <ShortcutCommand>{hotKey}</ShortcutCommand> + <ShortcutCommand>Shift</ShortcutCommand> + <ShortcutCommand>Z</ShortcutCommand>
      </>
    ),
  },
  {
    title: 'Multiple Block Selection',
    command: (
      <>
        <ShortcutCommand>Shift</ShortcutCommand> + Drag
      </>
    ),
  },
  {
    title: 'Search and Add Block',
    command: (
      <>
        <ShortcutCommand>Shift</ShortcutCommand> + <ShortcutCommand>Space</ShortcutCommand>
      </>
    ),
  },
  {
    title: 'Delete Block',
    command: (
      <>
        <ShortcutCommand>Backspace</ShortcutCommand> / <ShortcutCommand>Del</ShortcutCommand>
      </>
    ),
  },
  {
    title: 'Open Blocks Menu',
    command: <ShortcutCommand>{'<'}</ShortcutCommand>,
  },
  {
    title: 'Open Flows Menu',
    command: <ShortcutCommand>{'>'}</ShortcutCommand>,
  },
  {
    title: 'Toggle Left Menu',
    command: <ShortcutCommand>?</ShortcutCommand>,
  },
  {
    title: 'Go to Home',
    command: <ShortcutCommand>H</ShortcutCommand>,
  },
  {
    title: 'Zoom In',
    command: <ShortcutCommand>+</ShortcutCommand>,
  },
  {
    title: 'Zoom Out',
    command: <ShortcutCommand>-</ShortcutCommand>,
  },
  {
    title: 'Design',
    command: <ShortcutCommand>1</ShortcutCommand>,
  },
  {
    title: 'Prototype',
    command: <ShortcutCommand>2</ShortcutCommand>,
  },
  {
    title: 'Launch',
    command: <ShortcutCommand>3</ShortcutCommand>,
  },
];
