// eslint-disable "xss/no-mixed-html"
// eslint-disable "sonarjs/no-duplicate-string"

import './tag.css';

import { AtomicBlockUtils, EditorState } from 'draft-js';
import React from 'react';

import { makeCollapsed, reselect, selectBetween } from './selectUtil';
import Tag from './tag';

let getEditorState = null;
let setEditorState = null;

function dump(contentState) {
  contentState
    .getBlockMap()
    .toArray()
    .map((x, i) => console.log(i, x.toJS()));
}

function insertAtomic(editorState, key, offset, entity, text) {
  const selectionState = makeCollapsed(key, offset);
  const selectedEditorState = EditorState.acceptSelection(editorState, selectionState);
  return AtomicBlockUtils.insertAtomicBlock(selectedEditorState, entity, text);
}

function linkTags(contentState, entityKeyA, entityKeyB) {
  contentState = contentState.mergeEntityData(entityKeyA, { key: entityKeyA, otherKey: entityKeyB });
  contentState = contentState.mergeEntityData(entityKeyB, { key: entityKeyB, otherKey: entityKeyA });
  return contentState;
}

let oldBlock = null;
let storePlugin = null;
let store = null;

let storeState = {
  getEntity(key) {
    if (!store[key]) return null;
    return {
      getData() {
        return store[key];
      },
    };
  },
  mergeEntityData(key, data) {
    store[key] = { ...store[key], ...data };
    return storeState;
  },
};

const obj = {
  decorators: [
    {
      getDecorations(block) {
        const key = block.depth > 0 ? 'BOLD' : null;
        return Array(block.getLength()).fill(key);
      },
      getComponentForKey() {
        return ({ offsetKey, className, children }) => {
          return (
            <span data-offset-key={offsetKey} className={className}>
              <strong>{children}</strong>
            </span>
          );
        };
      },
      getPropsForKey() {
        return {};
      },
    },
  ],

  initialize(functions) {
    getEditorState = functions.getEditorState;
    setEditorState = functions.setEditorState;
    storePlugin = functions.getPlugins()[0];
  },
  blockRendererFn(block) {
    if (block.getType() === 'atomic') {
      return {
        component: Tag,
        editable: false,
        props: {
          store,
        },
      };
    }
    return null;
  },
  onChange(editorState) {
    store = storePlugin.getStore();

    const contentState = editorState.getCurrentContent();
    let depth = 0;
    let blockMap = contentState.getBlockMap();
    if (oldBlock && oldBlock.size > blockMap.size) {
      const toRemove = new Set();
      oldBlock
        .filter((block, key) => !blockMap.has(key) && block.getType() === 'atomic')
        .forEach((block) => {
          const key = block.getEntityAt(0);
          const entity = storeState.getEntity(key);
          if (!key || !entity) return;
          const otherKey = entity.getData().otherKey;
          toRemove.add(otherKey);
        });
      blockMap = blockMap.filter((block) => {
        if (block.getType() !== 'atomic') return true;
        const key = block.getEntityAt(0);
        return !toRemove.has(key);
      });
    }
    if (oldBlock !== blockMap) {
      blockMap = blockMap.map((block) => {
        if (block.getType() === 'atomic') {
          const key = block.getEntityAt(0);
          if (key) {
            const entity = contentState.getEntity(key);
            if (entity.type === 'OPEN') depth++;
            if (entity.type === 'CLOSE') depth--;
          }
        }
        return block.set('depth', depth);
      });

      oldBlock = blockMap;
      return EditorState.set(editorState, { currentContent: contentState.set('blockMap', blockMap) });
    }
    return editorState;
  },
  addEntity(type) {
    let editorState;
    let contentState;
    let selectionState;
    editorState = getEditorState();

    store = storePlugin.getStore();

    const undoStack = editorState.getUndoStack().push(editorState.getCurrentContent());
    editorState = EditorState.set(editorState, { allowUndo: false });

    selectionState = editorState.getSelection();
    contentState = editorState.getCurrentContent();

    const close = new Set();
    const open = new Set();
    for (let curKey = selectionState.getStartKey(); curKey !== selectionState.getEndKey(); curKey = contentState.getKeyAfter(curKey)) {
      const block = contentState.getBlockForKey(curKey);
      if (block.getType() === 'atomic') {
        const key = block.getEntityAt(0);
        if (key) {
          const entity = contentState.getEntity(key);
          if (entity.getType() === 'OPEN') {
            open.add(key);
          } else if (entity.getType() === 'CLOSE') {
            const otherKey = storeState.getEntity(key).getData().otherKey;
            if (open.has(otherKey)) {
              open.delete(otherKey);
            } else {
              close.add(key);
            }
          }
        }
      }
    }

    const openArr = [...open];
    const closeArr = [...close];

    contentState = editorState.getCurrentContent();

    contentState = contentState.createEntity('OPEN', 'IMMUTABLE', { type });
    const keyA = contentState.getLastCreatedEntityKey();

    contentState = contentState.createEntity('CLOSE', 'IMMUTABLE', { type });
    const keyB = contentState.getLastCreatedEntityKey();
    const openTag = {
      key: keyA,
      text: `<${type}>`,
    };
    const closeTag = {
      key: keyB,
      text: `</${type}>`,
    };
    storeState = linkTags(storeState, keyA, keyB);

    const closeList = [
      ...openArr.reverse().map((id) => {
        const entity = contentState.getEntity(id);
        const { type } = entity.getData();
        contentState = contentState.createEntity('CLOSE', 'IMMUTABLE', { type });
        const newKey = contentState.getLastCreatedEntityKey();
        storeState = linkTags(storeState, id, newKey);
        return {
          key: newKey,
          text: `</${type}>`,
        };
      }),
      closeTag,
      ...openArr.map((id) => {
        const entity = contentState.getEntity(id);
        const { type, otherKey } = { ...entity.getData(), ...store[id] };
        contentState = contentState.createEntity('OPEN', 'IMMUTABLE', { type });
        const newKey = contentState.getLastCreatedEntityKey();
        storeState = linkTags(storeState, otherKey, newKey);
        return {
          key: newKey,
          text: `<${type}>`,
        };
      }),
    ].reverse();
    const openList = [
      ...closeArr.map((id) => {
        const entity = contentState.getEntity(id);
        const { type, otherKey } = { ...entity.getData(), ...store[id] };
        contentState = contentState.createEntity('CLOSE', 'IMMUTABLE', { type });
        const newKey = contentState.getLastCreatedEntityKey();
        storeState = linkTags(storeState, otherKey, newKey);
        return {
          key: newKey,
          text: `</${type}>`,
        };
      }),
      openTag,
      ...closeArr.reverse().map((id) => {
        const entity = contentState.getEntity(id);
        const { type } = entity.getData();
        contentState = contentState.createEntity('OPEN', 'IMMUTABLE', { type });
        const newKey = contentState.getLastCreatedEntityKey();
        storeState = linkTags(storeState, id, newKey);
        return {
          key: newKey,
          text: `<${type}>`,
        };
      }),
    ].reverse();
    editorState = EditorState.push(editorState, contentState, 'apply-entity');

    closeList.forEach(({ key, text }) => {
      editorState = insertAtomic(editorState, selectionState.getEndKey(), selectionState.getEndOffset(), key, text);
    });

    openList.forEach(({ key, text }) => {
      editorState = insertAtomic(editorState, selectionState.getStartKey(), selectionState.getStartOffset(), key, text);
    });

    contentState = editorState.getCurrentContent();
    selectionState = selectBetween(contentState, keyA, keyB, selectionState);

    storePlugin.captureChange(contentState);
    editorState = EditorState.forceSelection(editorState, selectionState);
    editorState = EditorState.set(editorState, {
      undoStack,
      allowUndo: true,
    });
    setEditorState(editorState);
  },

  insertEntity(type) {
    let editorState;
    let contentState;
    let selectionState;
    editorState = getEditorState();
    const undoStack = editorState.getUndoStack().push(editorState.getCurrentContent());
    editorState = EditorState.set(editorState, { allowUndo: false });
    selectionState = editorState.getSelection();

    contentState = editorState.getCurrentContent();
    contentState = contentState.createEntity('VOID', 'IMMUTABLE', { type });
    const entityKey = contentState.getLastCreatedEntityKey();
    editorState = EditorState.push(editorState, contentState, 'apply-entity');
    editorState = insertAtomic(editorState, selectionState.getStartKey(), selectionState.getStartOffset(), entityKey, `<${type}/>`);

    contentState = editorState.getCurrentContent();
    selectionState = reselect(selectionState, contentState, entityKey);

    editorState = EditorState.forceSelection(editorState, selectionState);
    editorState = EditorState.set(editorState, {
      undoStack,
      allowUndo: true,
    });
    setEditorState(editorState);
  },
  handleReturn(e) {
    e.preventDefault();
    return 'handled';
  },
};
// REGEX to entity tags
// SPLIT if tag in selection
export default obj;
