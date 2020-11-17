import { CharacterMetadata, ContentBlock, ContentState, EditorState, SelectionState, convertToRaw } from 'draft-js';
import { Map } from 'immutable';

import { InlineStylePrefix } from './constants';

const INLINE_STYLE_SEPARATOR = '::';

const modifyInlineStyle = (contentState: ContentState, selectionState: SelectionState, inlineStyle: string, addOrRemove: boolean) => {
  const blockMap = contentState.getBlockMap();
  const startKey = selectionState.isCollapsed() ? blockMap.first().getKey() : selectionState.getStartKey();
  const startOffset = selectionState.isCollapsed() ? 0 : selectionState.getStartOffset();
  const endKey = selectionState.isCollapsed() ? blockMap.last().getKey() : selectionState.getEndKey();
  const endOffset = selectionState.isCollapsed() ? blockMap.last().getLength() : selectionState.getEndOffset();

  const newBlocks = blockMap
    .skipUntil((_, k) => k === startKey)
    .takeUntil((_, k) => k === endKey)
    .concat(Map([[endKey, blockMap.get(endKey)]]))
    .map((block, blockKey) => {
      let sliceStart;
      let sliceEnd;

      if (startKey === endKey) {
        sliceStart = startOffset;
        sliceEnd = endOffset;
      } else {
        sliceStart = blockKey === startKey ? startOffset : 0;
        sliceEnd = blockKey === endKey ? endOffset : block!.getLength();
      }

      let chars = block!.getCharacterList();
      let current;
      while (sliceStart < sliceEnd) {
        current = chars.get(sliceStart);
        chars = chars.set(
          sliceStart,
          addOrRemove ? CharacterMetadata.applyStyle(current, inlineStyle) : CharacterMetadata.removeStyle(current, inlineStyle)
        );
        sliceStart++;
      }

      return block!.set('characterList', chars) as ContentBlock;
    });

  return contentState.merge({
    blockMap: blockMap.merge(newBlocks),
    selectionAfter: selectionState,
    selectionBefore: selectionState,
  }) as ContentState;
};

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
    return style.last();
  }

  return null;
};

export const getFullTextSelection = (editorState: EditorState) => {
  const currentContent = editorState.getCurrentContent();
  const blockMap = currentContent.getBlockMap();
  const lastBlock = blockMap.last();
  const firstBlock = blockMap.first();
  const lastBlockKey = lastBlock.getKey();
  const firstBlockKey = firstBlock.getKey();
  const lengthOfLastBlock = lastBlock.getLength();

  return new SelectionState({
    focusKey: lastBlockKey,
    anchorKey: firstBlockKey,
    focusOffset: lengthOfLastBlock,
    anchorOffset: 0,
  });
};

export const getSelectionPrefixedInlineStyle = (
  editorState: EditorState,
  prefix: InlineStylePrefix,
  currentSelection: SelectionState = editorState.getSelection()
) => {
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

export const togglePrefixedInlineStyle = (editorState: EditorState, prefix: InlineStylePrefix, value?: string) => {
  const baseSelection = editorState.getSelection();
  const isCollapsed = baseSelection.isCollapsed();

  let selection = baseSelection;

  if (isCollapsed) {
    selection = getFullTextSelection(editorState);
  }

  const inlineStyles = getSelectionPrefixedInlineStyle(editorState, prefix, selection);

  let newContent = editorState.getCurrentContent();

  inlineStyles.forEach((inlineStyle) => {
    newContent = modifyInlineStyle(newContent, baseSelection, inlineStyle, false);
  });

  if (value) {
    newContent = modifyInlineStyle(newContent, baseSelection, createPrefixedInlineStyle(prefix, value), true);
  }

  return EditorState.push(editorState, newContent, 'change-inline-style');
};

export const applyFakeSelectionStyle = (editorState: EditorState) =>
  EditorState.push(
    editorState,
    modifyInlineStyle(editorState.getCurrentContent(), editorState.getSelection(), InlineStylePrefix.FAKE_SELECTION, true),
    'change-inline-style'
  );

export const removeFakeSelectionStyle = (editorState: EditorState) =>
  EditorState.push(
    editorState,
    modifyInlineStyle(editorState.getCurrentContent(), editorState.getSelection(), InlineStylePrefix.FAKE_SELECTION, false),
    'change-inline-style'
  );
