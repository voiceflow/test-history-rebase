import { AtomicBlockUtils, EditorState } from 'draft-js';

import { makeCollapsed } from './selectUtil';

export function dump(contentState) {
  contentState
    .getBlockMap()
    .toArray()
    // eslint-disable-next-line no-console
    .map((x, i) => console.log(i, x.toJS()));
}

export function insertAtomic(editorState, key, offset, entity, text) {
  const selectionState = makeCollapsed(key, offset);
  const selectedEditorState = EditorState.acceptSelection(editorState, selectionState);
  return AtomicBlockUtils.insertAtomicBlock(selectedEditorState, entity, text);
}

export function linkTags(store, a, b) {
  store[a] = { ...store[a], otherKey: b };
  store[b] = { ...store[b], otherKey: a };
}

export function findTagsBetween(contentState, store, start, stop) {
  const close = new Set();
  const open = new Set();
  const end = contentState.getKeyAfter(stop);
  for (let curKey = start; curKey !== end; curKey = contentState.getKeyAfter(curKey)) {
    const block = contentState.getBlockForKey(curKey);
    if (block.getType() === 'atomic' && block.getEntityAt(0)) {
      const key = block.getEntityAt(0);
      const entity = contentState.getEntity(key);
      if (entity.getType() === 'OPEN') {
        open.add(key);
      } else if (entity.getType() === 'CLOSE') {
        const otherKey = store[key].otherKey;
        if (open.has(otherKey)) {
          open.delete(otherKey);
        } else {
          close.add(key);
        }
      }
    }
  }
  return [[...open], [...close]];
}
