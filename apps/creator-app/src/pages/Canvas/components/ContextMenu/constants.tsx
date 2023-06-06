import { Nullish } from '@voiceflow/common';
import { COLOR_PICKER_CONSTANTS } from '@voiceflow/ui';
import React from 'react';

import { BlockType, CLIPBOARD_DATA_KEY } from '@/constants';
import { Hotkey, HOTKEY_LABEL_MAP, PLATFORM_META_KEY_LABEL } from '@/keymap';
import { ContextMenuTarget } from '@/pages/Canvas/constants';
import { isChipNode } from '@/utils/node';
import { isMarkupBlockType } from '@/utils/typeGuards';

import type Engine from '../../engine';
import { ContextColorPicker } from './components/ContextColorPicker';
import { ContextTemplateLibrary } from './components/ContextTemplateLibrary';
import { ContextMenuOption } from './types';

export enum CanvasAction {
  PASTE = 'paste',
  RENAME_BLOCK = 'rename_block',
  COPY_BLOCK = 'copy_block',
  DUPLICATE_BLOCK = 'duplicate_block',
  DELETE_BLOCK = 'delete_block',
  COLOR_BLOCK = 'color_block',
  SAVE_TO_LIBRARY = 'save_to_library',
  CREATE_COMPONENT = 'create_component',
  RETURN_TO_HOME = 'return_to_home',
  ZOOM_IN = 'zoom_in',
  ZOOM_OUT = 'zoom_out',
  DIVIDER = 'divider',
  TOGGLE_UI = 'toggle_ui',
  ADD_TEXT = 'add_text',
  ADD_IMAGE = 'add_image',
  ADD_COMMENT = 'add_comment',
  COPY_CONTENT = 'copy_content',
}

export const CANVAS_OPTIONS: ContextMenuOption<CanvasAction>[] = [
  {
    label: 'Paste',
    value: CanvasAction.PASTE,
    hotkey: `${PLATFORM_META_KEY_LABEL}+V`,
    shouldRender: () => !!localStorage.getItem(CLIPBOARD_DATA_KEY),
  },
  {
    label: 'Divider 1',
    value: CanvasAction.DIVIDER,
    menuItemProps: { divider: true },
    shouldRender: () => !!localStorage.getItem(CLIPBOARD_DATA_KEY),
  },
  {
    label: 'Add Text',
    value: CanvasAction.ADD_TEXT,
    hotkey: HOTKEY_LABEL_MAP[Hotkey.ADD_MARKUP_NOTE],
    shouldRender: (_, { showHintFeatures }) => showHintFeatures,
  },
  {
    label: 'Add Image',
    value: CanvasAction.ADD_IMAGE,
    hotkey: HOTKEY_LABEL_MAP[Hotkey.ADD_MARKUP_IMAGE],
    shouldRender: (_, { showHintFeatures }) => showHintFeatures,
  },
  {
    label: 'Add Comment',
    value: CanvasAction.ADD_COMMENT,
    hotkey: HOTKEY_LABEL_MAP[Hotkey.OPEN_COMMENTING],
    shouldRender: (_, { showHintFeatures }) => showHintFeatures,
  },
  {
    label: 'Divider 2',
    value: CanvasAction.DIVIDER,
    menuItemProps: { divider: true },
    shouldRender: (_, { showHintFeatures }) => showHintFeatures,
  },
  {
    label: 'Return to Start',
    value: CanvasAction.RETURN_TO_HOME,
    hotkey: HOTKEY_LABEL_MAP[Hotkey.ROOT_NODE],
    shouldRender: (_, { engine }) => !engine.comment.isModeActive,
  },
  {
    label: 'Zoom In',
    value: CanvasAction.ZOOM_IN,
    hotkey: HOTKEY_LABEL_MAP[Hotkey.ZOOM_IN],
  },
  {
    label: 'Zoom Out',
    value: CanvasAction.ZOOM_OUT,
    hotkey: HOTKEY_LABEL_MAP[Hotkey.ZOOM_OUT],
  },
  {
    label: 'Hide/Show UI',
    value: CanvasAction.TOGGLE_UI,
    hotkey: HOTKEY_LABEL_MAP[Hotkey.SHOW_HIDE_UI],
  },
];

const BLOCKS_WITH_RENAME = [BlockType.COMBINED, BlockType.START];

const isStart = (nodeID: Nullish<string>, engine: Engine) => engine.isNodeOfType(nodeID, BlockType.START);

const isBlock = (nodeID: Nullish<string>, engine: Engine) => engine.isNodeOfType(nodeID, BlockType.COMBINED);

const isMarkup = (nodeID: Nullish<string>, engine: Engine) => engine.isNodeOfType(nodeID, isMarkupBlockType);

const COMMENT_MENU_OPTION: ContextMenuOption<CanvasAction> = {
  label: 'Add comment',
  value: CanvasAction.ADD_COMMENT,
  hotkey: HOTKEY_LABEL_MAP[Hotkey.OPEN_COMMENTING],
  shouldRender: ({ target: nodeID }, { engine, showHintFeatures }) => showHintFeatures && !isMarkup(nodeID, engine),
};

const COPY_CONTENT_OPTION: ContextMenuOption<CanvasAction> = {
  label: 'Copy content',
  value: CanvasAction.COPY_CONTENT,
  shouldRender: ({ target: nodeID }, { engine }) => engine.isNodeOfType(nodeID, [BlockType.TEXT, BlockType.SPEAK]),
};

export const BLOCK_OPTIONS: ContextMenuOption<CanvasAction>[] = [
  {
    label: 'Block color',
    value: CanvasAction.COLOR_BLOCK,
    render: ({ target: nodeID }, { engine }) => {
      const node = engine.getNodeByID(nodeID);
      const isChip = isChipNode(engine.getNodeByID(node?.combinedNodes[0]), node);
      const defaultColorScheme = isChip ? COLOR_PICKER_CONSTANTS.ColorScheme.DARK : COLOR_PICKER_CONSTANTS.ColorScheme.LIGHT;
      const standardColor = isChip ? COLOR_PICKER_CONSTANTS.CHIP_STANDARD_COLOR : COLOR_PICKER_CONSTANTS.BLOCK_STANDARD_COLOR;

      return (
        <ContextColorPicker
          defaultColorScheme={node?.type === BlockType.START ? COLOR_PICKER_CONSTANTS.ColorScheme.BLACK : defaultColorScheme}
          standardColor={standardColor}
        />
      );
    },
    shouldRender: ({ target: nodeID }, { engine }) => isBlock(nodeID, engine) || isStart(nodeID, engine),
  },
  {
    label: 'Save to library',
    value: CanvasAction.SAVE_TO_LIBRARY,
    render: () => <ContextTemplateLibrary />,
    shouldRender: ({ target: nodeID }, { engine }) => !isStart(nodeID, engine),
  },
  {
    label: 'Create component',
    value: CanvasAction.CREATE_COMPONENT,
    hotkey: HOTKEY_LABEL_MAP[Hotkey.CREATE_COMPONENT],
    shouldRender: ({ target: nodeID }, { engine }) => engine.isNodeOfType(nodeID, BlockType.COMBINED),
  },
  COMMENT_MENU_OPTION,
  {
    label: 'Divider 1',
    value: CanvasAction.DIVIDER,
    menuItemProps: { divider: true },
    shouldRender: ({ target: nodeID }, { engine, showHintFeatures }) =>
      (showHintFeatures && !isMarkup(nodeID, engine)) || isBlock(nodeID, engine) || engine.isNodeOfType(nodeID, BLOCKS_WITH_RENAME),
  },
  {
    label: 'Rename',
    value: CanvasAction.RENAME_BLOCK,
    shouldRender: ({ target: nodeID }, { engine }) => engine.isNodeOfType(nodeID, BLOCKS_WITH_RENAME),
  },
  {
    label: 'Copy',
    value: CanvasAction.COPY_BLOCK,
    hotkey: HOTKEY_LABEL_MAP[Hotkey.COPY],
    shouldRender: ({ target: nodeID }, { engine }) => !isStart(nodeID, engine),
  },
  {
    label: 'Duplicate',
    value: CanvasAction.DUPLICATE_BLOCK,
    hotkey: HOTKEY_LABEL_MAP[Hotkey.DUPLICATE],
    shouldRender: ({ target: nodeID }, { engine }) => !isStart(nodeID, engine),
  },
  {
    label: 'Divider 2',
    value: CanvasAction.DIVIDER,
    menuItemProps: { divider: true },
    shouldRender: ({ target: nodeID }, { engine }) => !isStart(nodeID, engine),
  },
  {
    label: 'Delete',
    value: CanvasAction.DELETE_BLOCK,
    hotkey: HOTKEY_LABEL_MAP[Hotkey.DELETE],
    shouldRender: ({ target: nodeID }, { engine }) => !isStart(nodeID, engine),
  },
];

export const VIEWER_BLOCK_OPTIONS: ContextMenuOption<CanvasAction>[] = [COMMENT_MENU_OPTION, COPY_CONTENT_OPTION];

export const SELECTION_OPTIONS: ContextMenuOption<CanvasAction>[] = [
  {
    label: 'Copy',
    value: CanvasAction.COPY_BLOCK,
    hotkey: HOTKEY_LABEL_MAP[Hotkey.COPY],
  },
  {
    label: 'Duplicate',
    value: CanvasAction.DUPLICATE_BLOCK,
    hotkey: HOTKEY_LABEL_MAP[Hotkey.DUPLICATE],
  },
  {
    label: 'Divider 1',
    value: CanvasAction.DIVIDER,
    menuItemProps: { divider: true },
  },
  {
    label: 'Block color',
    value: CanvasAction.COLOR_BLOCK,
    render: () => <ContextColorPicker />,
  },
  {
    label: 'Save to library',
    value: CanvasAction.SAVE_TO_LIBRARY,
    render: () => <ContextTemplateLibrary />,
  },
  {
    label: 'Create component',
    value: CanvasAction.CREATE_COMPONENT,
    hotkey: HOTKEY_LABEL_MAP[Hotkey.CREATE_COMPONENT],
    shouldRender: (_, { engine }) => engine.selection.getTargets().some((nodeID) => engine.isNodeOfType(nodeID, BlockType.COMBINED)),
  },
  {
    label: 'Divider 2',
    value: CanvasAction.DIVIDER,
    menuItemProps: { divider: true },
  },
  {
    label: 'Delete',
    value: CanvasAction.DELETE_BLOCK,
    hotkey: HOTKEY_LABEL_MAP[Hotkey.DELETE],
  },
];

type TargetOptions = Record<ContextMenuTarget, (props: { viewerOnly?: boolean }) => ContextMenuOption<CanvasAction>[]>;

export const TARGET_OPTIONS: TargetOptions = {
  [ContextMenuTarget.NODE]: ({ viewerOnly }) => (viewerOnly ? VIEWER_BLOCK_OPTIONS : BLOCK_OPTIONS),
  [ContextMenuTarget.CANVAS]: ({ viewerOnly }) => (viewerOnly ? [] : CANVAS_OPTIONS),
  [ContextMenuTarget.SELECTION]: ({ viewerOnly }) => (viewerOnly ? [] : SELECTION_OPTIONS),
};
