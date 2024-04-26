import React from 'react';

import { PLATFORM_META_KEY_LABEL } from '@/keymap';

import { ShortcutCommand } from './styles';

interface ShortcutItem {
  title: string;
  command: React.ReactNode;
  shouldRender?: () => boolean;
}

export const SHORTCUTS: ShortcutItem[] = [
  {
    title: 'Copy',
    command: (
      <>
        <ShortcutCommand>{PLATFORM_META_KEY_LABEL}</ShortcutCommand> + <ShortcutCommand>C</ShortcutCommand>
      </>
    ),
  },
  {
    title: 'Paste',
    command: (
      <>
        <ShortcutCommand>{PLATFORM_META_KEY_LABEL}</ShortcutCommand> + <ShortcutCommand>V</ShortcutCommand>
      </>
    ),
  },
  {
    title: 'Duplicate',
    command: (
      <>
        <ShortcutCommand>{PLATFORM_META_KEY_LABEL}</ShortcutCommand> + <ShortcutCommand>D</ShortcutCommand>
      </>
    ),
  },
  {
    title: 'Undo',
    command: (
      <>
        <ShortcutCommand>{PLATFORM_META_KEY_LABEL}</ShortcutCommand> + <ShortcutCommand>Z</ShortcutCommand>
      </>
    ),
  },
  {
    title: 'Redo',
    command: (
      <>
        <ShortcutCommand>{PLATFORM_META_KEY_LABEL}</ShortcutCommand> + <ShortcutCommand>Shift</ShortcutCommand> +{' '}
        <ShortcutCommand>Z</ShortcutCommand>
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
    title: 'Show/Hide UI',
    command: (
      <>
        <ShortcutCommand>{PLATFORM_META_KEY_LABEL}</ShortcutCommand> + <ShortcutCommand>\</ShortcutCommand>
      </>
    ),
  },
  {
    title: 'Go to Start Block',
    command: <ShortcutCommand>S</ShortcutCommand>,
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
    title: 'Pan',
    command: (
      <>
        <ShortcutCommand>Space</ShortcutCommand> + <ShortcutCommand>Drag</ShortcutCommand>
      </>
    ),
  },
  {
    title: 'Run Assistant',
    command: <ShortcutCommand>R</ShortcutCommand>,
  },
  {
    title: 'Add Note',
    command: <ShortcutCommand>N</ShortcutCommand>,
  },
  {
    title: 'Add Image',
    command: <ShortcutCommand>I</ShortcutCommand>,
  },
  {
    title: 'NLU Model',
    command: <ShortcutCommand>M</ShortcutCommand>,
  },
  {
    title: 'Commenting',
    command: <ShortcutCommand>C</ShortcutCommand>,
  },
  {
    title: 'Upload',
    command: (
      <>
        <ShortcutCommand>{PLATFORM_META_KEY_LABEL}</ShortcutCommand> + <ShortcutCommand>U</ShortcutCommand>
      </>
    ),
  },
];
