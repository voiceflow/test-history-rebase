import { ContentBlock, EditorState, Modifier, convertToRaw } from 'draft-js';

import { InlineStylePrefix } from './constants';

const INLINE_STYLE_SEPARATOR = '::';

export const getRawContent = (editorState: EditorState) => {
  return convertToRaw(editorState.getCurrentContent());
};

export const createPrefixedInlineStyle = (prefix: InlineStylePrefix, value: string) => `${prefix}${INLINE_STYLE_SEPARATOR}${value}`;

export const isPrefixedInlineStyle = (prefix: InlineStylePrefix) => (style: string | undefined) =>
  !!style?.startsWith(`${prefix}${INLINE_STYLE_SEPARATOR}`);

export const getInlineStylePrefixAndValue = (style: string | undefined) =>
  !style ? ([] as []) : (style.split(INLINE_STYLE_SEPARATOR) as [string, string] | [string]);

export const getSelectedBlocksList = (editorState: EditorState) => {
  const selectionState = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  const startKey = selectionState.getStartKey();
  const endKey = selectionState.getEndKey();
  const blockMap = contentState.getBlockMap();

  return blockMap
    .toSeq()
    .skipUntil((_, k) => k === startKey)
    .takeUntil((_, k) => k === endKey)
    .concat([[endKey, blockMap.get(endKey)]])
    .toList();
};

export const getCurrentPrefixedInlineStyle = (editorState: EditorState, prefix: InlineStylePrefix) => {
  const styles = editorState.getCurrentInlineStyle().toList();

  const style = styles.filter(isPrefixedInlineStyle(prefix));

  if (style?.size > 0) {
    return style.get(0);
  }

  return null;
};

export const getPrefixedStyleAtOffset = (block: ContentBlock, prefix: InlineStylePrefix, offset: number) => {
  const styles = block.getInlineStyleAt(offset).toList();

  const style = styles.filter(isPrefixedInlineStyle(prefix));

  if (style?.size > 0) {
    return style.get(0);
  }

  return null;
};

export const getSelectionPrefixedInlineStyle = (editorState: EditorState, prefix: InlineStylePrefix) => {
  const currentSelection = editorState.getSelection();
  const inlineStyles: string[] = [];

  const start = currentSelection.getStartOffset();
  const end = currentSelection.getEndOffset();
  const selectedBlocks = getSelectedBlocksList(editorState);

  if (selectedBlocks.size > 0) {
    for (let i = 0; i < selectedBlocks.size; i += 1) {
      let blockStart = i === 0 ? start : 0;
      let blockEnd = i === selectedBlocks.size - 1 ? end : selectedBlocks.get(i).getText().length;

      if (blockStart === blockEnd && blockStart === 0) {
        blockStart = 1;
        blockEnd = 2;
      } else if (blockStart === blockEnd) {
        blockStart -= 1;
      }

      for (let j = blockStart; j < blockEnd; j += 1) {
        const style = getPrefixedStyleAtOffset(selectedBlocks.get(i), prefix, j);

        if (style) {
          inlineStyles.push(style);
        }
      }
    }
  }

  return [...new Set(inlineStyles)];
};

export const togglePrefixedInlineStyle = (editorState: EditorState, prefix: InlineStylePrefix, value: string) => {
  const selection = editorState.getSelection();

  const inlineStyles = getSelectionPrefixedInlineStyle(editorState, prefix);

  if (selection.isCollapsed()) {
    return editorState;
  }

  let newContent = editorState.getCurrentContent();

  inlineStyles.forEach((inlineStyle) => {
    newContent = Modifier.removeInlineStyle(newContent, selection, inlineStyle);
  });

  if (value) {
    newContent = Modifier.applyInlineStyle(newContent, selection, createPrefixedInlineStyle(prefix, value));
  }

  return EditorState.push(editorState, newContent, 'change-inline-style');
};
