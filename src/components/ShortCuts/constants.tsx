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
    message: (
      <>
        <kbd>{hotKey}</kbd> + <kbd>&#60;</kbd>
      </>
    ),
  },
  {
    title: 'Open Flows Menu',
    message: (
      <>
        <kbd>{hotKey}</kbd> + <kbd>&#62;</kbd>
      </>
    ),
  },
  {
    title: 'Go to Home',
    message: (
      <>
        <kbd>{hotKey}</kbd> + <kbd>H</kbd>
      </>
    ),
  },
  {
    title: 'Zoom In',
    message: (
      <>
        <kbd>{hotKey}</kbd> + <kbd>+</kbd>
      </>
    ),
  },
  {
    title: 'Zoom Out',
    message: (
      <>
        <kbd>{hotKey}</kbd> + <kbd>-</kbd>
      </>
    ),
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
