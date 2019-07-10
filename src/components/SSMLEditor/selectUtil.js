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

export function reselect(selectionState, contentState, tag) {
  const startKey = selectionState.getStartKey();
  const startOffset = selectionState.getStartOffset();
  const endKey = selectionState.getEndKey();
  const endOffset = selectionState.getEndOffset();

  let curKey = selectionState.getStartKey();
  let curBlock = contentState.getBlockForKey(curKey);
  while (curBlock.getType() !== 'atomic' || curBlock.getEntityAt(0) !== tag) {
    curKey = contentState.getKeyAfter(curKey);
    curBlock = contentState.getBlockForKey(curKey);
  }

  const newStartKey = contentState.getKeyAfter(curKey);
  const newStartOffset = startOffset - contentState.getBlockForKey(startKey).getLength();
  let newEndKey = endKey;
  let newEndOffset = endOffset;

  if (startKey === endKey) {
    newEndKey = newStartKey;
    newEndOffset = endOffset - contentState.getBlockForKey(startKey).getLength();
  }

  return makeSelection(newStartKey, newStartOffset, newEndKey, newEndOffset, selectionState.getIsBackward());
}
