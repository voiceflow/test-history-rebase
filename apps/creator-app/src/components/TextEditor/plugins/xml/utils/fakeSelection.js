import { EditorState, Modifier } from 'draft-js';

import { EntityType, Mutability, PushAction } from '../../constants';
import { getEntitySelectionByKey } from '../../utils';

export const addFakeSelection = (editorState) => {
  let content = editorState.getCurrentContent();
  const selection = editorState.getSelection();

  content = content.createEntity(EntityType.FAKE_SELECTION, Mutability.MUTABLE, {
    key: null,
  });

  const key = content.getLastCreatedEntityKey();

  content = content.mergeEntityData(key, { key });

  content = Modifier.applyEntity(content, selection, key);

  return {
    key,
    editorState: EditorState.push(editorState, content, PushAction.APPLY_ENTITY),
  };
};

export const removeFakeSelection = (editorState, key) => {
  const selection = getEntitySelectionByKey(editorState, key);

  let content = editorState.getCurrentContent();

  content = Modifier.applyEntity(content, selection, null);

  return EditorState.push(editorState, content, PushAction.APPLY_ENTITY);
};
