export const getEntityAtStartSelection = (editorState, selection, adjustOffset = 0) => {
  const selectionKey = selection.getStartKey();
  const content = editorState.getCurrentContent();
  const block = content.getBlockForKey(selectionKey);
  const entityKey = block.getEntityAt(selection.getStartOffset() + adjustOffset);

  return entityKey ? content.getEntity(entityKey) : null;
};

export const getEntityAtEndSelection = (editorState, selection, adjustOffset = 0) => {
  const selectionKey = selection.getStartKey();
  const content = editorState.getCurrentContent();
  const block = content.getBlockForKey(selectionKey);
  const entityKey = block.getEntityAt(selection.getEndOffset() + adjustOffset);

  return entityKey ? content.getEntity(entityKey) : null;
};

export const getEntitySelection = (editorState, entity) => {
  const selection = editorState.getSelection();
  const selectionKey = selection.getStartKey();
  const content = editorState.getCurrentContent();
  const block = content.getBlockForKey(selectionKey);

  let entitySelection = null;

  block.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();

      return !!entityKey && content.getEntity(entityKey) === entity;
    },
    (start, end) => {
      entitySelection = selection.merge({ focusOffset: end, anchorOffset: start });
    }
  );

  return entitySelection;
};

export const getEntitySelectionByKey = (editorState, entityKey) => {
  const selection = editorState.getSelection();
  const selectionKey = selection.getStartKey();
  const content = editorState.getCurrentContent();
  const block = content.getBlockForKey(selectionKey);

  let entitySelection = null;

  block.findEntityRanges(
    (character) => !!entityKey && character.getEntity() === entityKey,
    (start, end) => {
      entitySelection = selection.merge({ focusOffset: end, anchorOffset: start });
    }
  );

  return entitySelection;
};

export const findEntitiesAndRangesAtSelection = (editorState, selection, types) => {
  const endOffset = selection.getEndOffset();
  const startOffset = selection.getStartOffset();
  const selectionKey = selection.getStartKey();
  const content = editorState.getCurrentContent();
  const block = content.getBlockForKey(selectionKey);

  const entities = [];
  let entity;

  block.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();

      if (!entityKey) {
        return false;
      }

      entity = content.getEntity(entityKey);

      return types ? types.includes(entity.getType()) : true;
    },
    (start, end) => {
      if (start >= startOffset && end <= endOffset) {
        entities.push({ end, start, entity });
      }
    }
  );

  return entities;
};
