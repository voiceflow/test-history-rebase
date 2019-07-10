import { SelectionState } from 'draft-js';

function makeSelection(startKey, startOffset, endKey, endOffset, isBackward) {
  return SelectionState.createEmpty().merge({
    [isBackward ? 'focusKey' : 'anchorKey']: startKey,
    [isBackward ? 'focusOffset' : 'anchorOffset']: startOffset,
    [isBackward ? 'anchorKey' : 'focusKey']: endKey,
    [isBackward ? 'anchorOffset' : 'focusOffset']: endOffset,
    isBackward,
    hasFocus: true,
  });
}

export function makeStable(editorState) {
  const selectionState = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  const startKey = selectionState.getStartKey();
  const startOffset = selectionState.getStartOffset();
  let curKey = startKey;
  let endOffset = selectionState.getEndOffset();
  const startTags = 0;
  let deltaTags = 0;
  while (curKey !== selectionState.getEndKey()) {
    const block = contentState.getBlockForKey(curKey);
    if (block.getType() === 'atomic') {
      deltaTags++;
    } else {
      endOffset += block.getLength();
    }
    curKey = contentState.getKeyAfter(curKey);
  }
  return { startKey, startOffset, startTags, endOffset, deltaTags, isBackward: selectionState.isBackward };
}

function getPoint(startKey, offset, contentState, tags, start = false) {
  let curKey = startKey;
  let curOffset = offset;
  let block = contentState.getBlockForKey(curKey);
  let curTags = tags;

  while (curOffset > block.getLength() || ((start || block.getType() === 'atomic') && curTags > 0)) {
    if (block.getType() === 'atomic') {
      curTags--;
    } else {
      curOffset -= block.getLength();
    }
    curKey = contentState.getKeyAfter(curKey);
    block = contentState.getBlockForKey(curKey);
  }

  return [curKey, curOffset];
}

export function fromStable(stable, contentState) {
  const [startKey, startOffset] = getPoint(stable.startKey, stable.startOffset, contentState, stable.startTags, true);
  if (stable.startOffset === stable.endOffset) return makeSelection(startKey, startOffset, startKey, startOffset, stable.isBackward);

  const [endKey, endOffset] = getPoint(stable.startKey, stable.endOffset, contentState, stable.startTags + stable.deltaTags);
  return makeSelection(startKey, startOffset, endKey, endOffset, stable.isBackward);
}

export function makeCollapsed(key, offset) {
  return makeSelection(key, offset, key, offset, false);
}
