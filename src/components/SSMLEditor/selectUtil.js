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
    if (block.getType() === 'atomic' || block.getLength() === 0) {
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
  if (block.getLength() === 0) curTags++;

  while (curOffset > block.getLength() || ((block.getType() === 'atomic' || block.getLength() === 0) && curTags > 0)) {
    if (block.getType() === 'atomic' || block.getLength() === 0) {
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
  if (stable.startOffset === stable.endOffset && !stable.deltaTags)
    return makeSelection(startKey, startOffset, startKey, startOffset, stable.isBackward);

  const [endKey, endOffset] = getPoint(stable.startKey, stable.endOffset, contentState, stable.startTags + stable.deltaTags);
  return makeSelection(startKey, startOffset, endKey, endOffset, stable.isBackward);
}

export function selectBetween(contentState, start, stop, selectionState) {
  let curKey = selectionState.getStartKey();
  let curBlock = contentState.getBlockForKey(curKey);
  while (curBlock.getType() !== 'atomic' || curBlock.getEntityAt(0) !== start) {
    curKey = contentState.getKeyAfter(curKey);
    curBlock = contentState.getBlockForKey(curKey);
  }

  const startKey = contentState.getKeyAfter(curKey);

  while (curBlock.getType() !== 'atomic' || curBlock.getEntityAt(0) !== stop) {
    curKey = contentState.getKeyAfter(curKey);
    curBlock = contentState.getBlockForKey(curKey);
  }

  const endKey = contentState.getKeyBefore(curKey);

  return makeSelection(startKey, 0, endKey, contentState.getBlockForKey(endKey).getLength(), selectionState.getIsBackward());
}

export function makeCollapsed(key, offset) {
  return makeSelection(key, offset, key, offset, false);
}
