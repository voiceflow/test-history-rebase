import { EditorState, Modifier } from 'draft-js';

import { Mutability, PushAction } from '../../constants';
import { getEntityAtEndSelection, getEntityAtStartSelection, getEntitySelection } from '../../utils';

// eslint-disable-next-line sonarjs/cognitive-complexity
export default (store) => (e) => {
  e.preventDefault();
  e.stopPropagation?.();
  e.stopImmediatePropagation?.();

  let editorState = store.getEditorState();
  let selection = editorState.getSelection();

  const anchorOffset = selection.getAnchorOffset();
  const focusOffset = selection.getFocusOffset();
  const endOffset = selection.getEndOffset();
  const startOffset = selection.getStartOffset();

  if (endOffset !== startOffset || anchorOffset !== 0) {
    if (endOffset !== startOffset) {
      const leftRightSelection = focusOffset > anchorOffset;

      const endSelectionEntity = getEntityAtEndSelection(editorState, selection);
      const startSelectionEntity = getEntityAtStartSelection(editorState, selection);

      if (startSelectionEntity && startSelectionEntity.getMutability() === Mutability.IMMUTABLE) {
        const startEntitySelection = getEntitySelection(editorState, startSelectionEntity);

        selection = selection.merge({
          [leftRightSelection ? 'anchorOffset' : 'focusOffset']: startEntitySelection.getAnchorOffset(),
        });
      }

      if (endSelectionEntity && endSelectionEntity.getMutability() === Mutability.IMMUTABLE) {
        const endEntitySelection = getEntitySelection(editorState, endSelectionEntity);

        selection = selection.merge({
          [leftRightSelection ? 'focusOffset' : 'anchorOffset']: endEntitySelection.getFocusOffset(),
        });
      }

      const nextContent = Modifier.removeRange(editorState.getCurrentContent(), selection);

      editorState = EditorState.push(editorState, nextContent, PushAction.REMOVE_RANGE);
    } else {
      const isDelete = e.code === 'Delete';

      const startSelectionEntity = getEntityAtStartSelection(
        editorState,
        editorState.getSelection(),
        isDelete ? 0 : -1
      );

      if (startSelectionEntity && startSelectionEntity.getMutability() === Mutability.IMMUTABLE) {
        selection = getEntitySelection(editorState, startSelectionEntity) || selection;
      } else {
        selection = selection.merge({
          focusOffset: focusOffset + (isDelete ? 1 : 0),
          anchorOffset: anchorOffset + (isDelete ? 0 : -1),
        });
      }

      const nextContent = Modifier.removeRange(
        editorState.getCurrentContent(),
        selection,
        isDelete ? 'backward' : 'forward'
      );

      editorState = EditorState.push(editorState, nextContent, PushAction.DELETE_CHARACTER);
    }

    store.setEditorState(editorState);
  }

  return { state: 'handled', editorState, selection };
};
