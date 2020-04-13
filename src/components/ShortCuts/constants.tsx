import React from 'react';

import { isMac } from '@/config';

const hotKey = isMac ? '⌘' : 'Ctrl';

export const BLOCK_REDESIGN_SHORTCUTS = [
  {
    title: 'Copy',
    message: (
      <>
        <kbd>{hotKey}</kbd> + <kbd>C</kbd>
      </>
    ),
  },
  {
    title: 'Paste',
    message: (
      <>
        <kbd>{hotKey}</kbd> + <kbd>V</kbd>
      </>
    ),
  },
  {
    title: 'Undo',
    message: (
      <>
        <kbd>{hotKey}</kbd> + <kbd>Z</kbd>
      </>
    ),
  },
  {
    title: 'Redo',
    message: (
      <>
        <kbd>{hotKey}</kbd> + <kbd>Shift</kbd> + <kbd>Z</kbd>
      </>
    ),
  },
  {
    title: 'Comment',
    message: (
      <>
        <kbd>{hotKey}</kbd> + <kbd>/</kbd>
      </>
    ),
  },
  {
    title: 'Multiple Block Selection',
    message: (
      <>
        <kbd>Shift</kbd> + Drag
      </>
    ),
  },
  {
    title: 'Search and Add Block',
    message: (
      <>
        <kbd>Space</kbd>
      </>
    ),
  },
  {
    title: 'Delete Block',
    message: (
      <>
        <kbd>Backspace</kbd> / <kbd>Del</kbd>
      </>
    ),
  },
  {
    title: 'Open Blocks Menu',
    message: <kbd>{'<'}</kbd>,
  },
  {
    title: 'Open Flows Menu',
    message: <kbd>{'>'}</kbd>,
  },
  {
    title: 'Toggle Left Menu',
    message: <kbd>?</kbd>,
  },
  {
    title: 'Go to Home',
    message: <kbd>H</kbd>,
  },
  {
    title: 'Zoom In',
    message: <kbd>+</kbd>,
  },
  {
    title: 'Zoom Out',
    message: <kbd>-</kbd>,
  },
  {
    title: 'Design',
    message: <kbd>D</kbd>,
  },
  {
    title: 'Prototype',
    message: <kbd>P</kbd>,
  },
  {
    title: 'Build',
    message: <kbd>B</kbd>,
  },
];

export const SHORTCUTS = [
  {
    title: 'Copy',
    message: (
      <>
        <kbd>{hotKey}</kbd> + <kbd>C</kbd>
      </>
    ),
  },
  {
    title: 'Paste',
    message: (
      <>
        <kbd>{hotKey}</kbd> + <kbd>V</kbd>
      </>
    ),
  },
  {
    title: 'Undo',
    message: (
      <>
        <kbd>{hotKey}</kbd> + <kbd>Z</kbd>
      </>
    ),
  },
  {
    title: 'Redo',
    message: (
      <>
        <kbd>{hotKey}</kbd> + <kbd>Shift</kbd> + <kbd>Z</kbd>
      </>
    ),
  },
  {
    title: 'Comment',
    message: (
      <>
        <kbd>{hotKey}</kbd> + <kbd>/</kbd>
      </>
    ),
  },
  {
    title: 'Multiple Block Selection',
    message: (
      <>
        <kbd>Shift</kbd> + Drag
      </>
    ),
  },
  {
    title: 'Search and Add Block',
    message: (
      <>
        <kbd>Space</kbd>
      </>
    ),
  },
  {
    title: 'Delete Block',
    message: (
      <>
        <kbd>Backspace</kbd> / <kbd>Del</kbd>
      </>
    ),
  },
  {
    title: 'Open Blocks Menu',
    message: (
      <>
        <kbd>Shift</kbd> + <kbd>1</kbd>
      </>
    ),
  },
  {
    title: 'Open Flows Menu',
    message: (
      <>
        <kbd>Shift</kbd> + <kbd>2</kbd>
      </>
    ),
  },
  {
    title: 'Open Variables Menu',
    message: (
      <>
        <kbd>Shift</kbd> + <kbd>3</kbd>
      </>
    ),
  },
];
