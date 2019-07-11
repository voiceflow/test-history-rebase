// eslint-disable "xss/no-mixed-html"
// eslint-disable "sonarjs/no-duplicate-string"

import { EditorState } from 'draft-js';

import Tag from './Tag';
import depthDecorator from './depthDecorator';
import { reselect, selectBetween } from './selectUtil';
import { makeEndTag, makeStartTag } from './tagUtil';
import { findTagsBetween, insertAtomic, linkTags } from './util';

function createTagPlugin(storePlugin) {
  let getEditorState = null;
  let setEditorState = null;

  let previousBlocks = null;

  return {
    decorators: [depthDecorator],

    initialize(functions) {
      getEditorState = functions.getEditorState;
      setEditorState = functions.setEditorState;
    },
    blockRendererFn(block) {
      if (block.getType() === 'atomic') {
        return {
          component: Tag,
          editable: false,
          props: storePlugin.getStore(),
        };
      }
      return null;
    },
    onChange(editorState) {
      const store = storePlugin.getStore();

      const contentState = editorState.getCurrentContent();
      let depth = 0;
      let blockMap = contentState.getBlockMap();
      if (previousBlocks && previousBlocks.size > blockMap.size) {
        const toRemove = new Set();
        previousBlocks
          .filter((block, key) => !blockMap.has(key) && block.getType() === 'atomic')
          .forEach((block) => {
            const key = block.getEntityAt(0);
            const pair = store[key];
            if (!pair) return;
            toRemove.add(pair.otherKey);
          });
        blockMap = blockMap.filter((block) => {
          if (block.getType() !== 'atomic') return true;
          const key = block.getEntityAt(0);
          return !toRemove.has(key);
        });
      }
      if (previousBlocks !== blockMap) {
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

        previousBlocks = blockMap;
        return EditorState.set(editorState, { currentContent: contentState.set('blockMap', blockMap) });
      }
      return editorState;
    },
    addEntity(data) {
      let editorState;
      let contentState;
      let selectionState;
      editorState = getEditorState();

      const store = storePlugin.getStore();

      const undoStack = editorState.getUndoStack().push(editorState.getCurrentContent());
      editorState = EditorState.set(editorState, { allowUndo: false });

      selectionState = editorState.getSelection();
      contentState = editorState.getCurrentContent();

      const [open, close] = findTagsBetween(contentState, store, selectionState.getStartKey(), selectionState.getEndKey());

      contentState = contentState.createEntity('OPEN', 'IMMUTABLE', data);
      const keyA = contentState.getLastCreatedEntityKey();

      contentState = contentState.createEntity('CLOSE', 'IMMUTABLE', data);
      const keyB = contentState.getLastCreatedEntityKey();

      const openTag = {
        key: keyA,
        text: makeStartTag(data),
      };
      const closeTag = {
        key: keyB,
        text: makeEndTag(data),
      };
      linkTags(store, keyA, keyB);

      const storeCopy = JSON.parse(JSON.stringify(store));

      const openList = [
        ...close.map((id) => {
          const data = contentState.getEntity(id).getData();
          contentState = contentState.createEntity('CLOSE', 'IMMUTABLE', data);
          const newKey = contentState.getLastCreatedEntityKey();
          linkTags(store, storeCopy[id].otherKey, newKey);
          return {
            key: newKey,
            text: makeEndTag(data),
          };
        }),
        openTag,
        ...close.reverse().map((id) => {
          const data = contentState.getEntity(id).getData();
          contentState = contentState.createEntity('OPEN', 'IMMUTABLE', data);
          const newKey = contentState.getLastCreatedEntityKey();
          linkTags(store, id, newKey);
          return {
            key: newKey,
            text: makeStartTag(data),
          };
        }),
      ].reverse();

      const closeList = [
        ...open.reverse().map((id) => {
          const data = contentState.getEntity(id).getData();
          contentState = contentState.createEntity('CLOSE', 'IMMUTABLE', data);
          const newKey = contentState.getLastCreatedEntityKey();
          linkTags(store, id, newKey);
          return {
            key: newKey,
            text: makeEndTag(data),
          };
        }),
        closeTag,
        ...open.map((id) => {
          const data = contentState.getEntity(id).getData();
          contentState = contentState.createEntity('OPEN', 'IMMUTABLE', data);
          const newKey = contentState.getLastCreatedEntityKey();
          linkTags(store, storeCopy[id].otherKey, newKey);
          return {
            key: newKey,
            text: makeStartTag(data),
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
      editorState = EditorState.forceSelection(editorState, selectionState);

      storePlugin.captureChange(contentState);
      editorState = EditorState.set(editorState, {
        undoStack,
        allowUndo: true,
      });

      setEditorState(editorState);
    },

    insertEntity(data) {
      let editorState;
      let contentState;
      let selectionState;

      editorState = getEditorState();
      selectionState = editorState.getSelection();
      contentState = editorState.getCurrentContent();

      const undoStack = editorState.getUndoStack().push(contentState);
      editorState = EditorState.set(editorState, { allowUndo: false });

      contentState = contentState.createEntity('VOID', 'IMMUTABLE', data);
      const entityKey = contentState.getLastCreatedEntityKey();
      editorState = EditorState.push(editorState, contentState, 'apply-entity');
      editorState = insertAtomic(editorState, selectionState.getStartKey(), selectionState.getStartOffset(), entityKey, makeStartTag(data));

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
}

export default createTagPlugin;
