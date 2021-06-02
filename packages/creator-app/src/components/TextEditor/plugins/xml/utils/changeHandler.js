import { EditorState, Modifier } from 'draft-js';

import { PushAction } from '../../constants';
import { getEntityAtEndSelection, getEntityAtStartSelection, getEntitySelection } from '../../utils';
import isXMLEntity from './isXMLEntity';

const selectTag = ({ selection: prevSelection, editorState: prevEditorState, isBackDirection, entityAtStartSelection }) => {
  let editorState = prevEditorState;
  let selection = prevSelection;
  let entitySelection = getEntitySelection(editorState, entityAtStartSelection);
  let nextEntity = getEntityAtEndSelection(editorState, entitySelection);

  while (isXMLEntity(nextEntity) && nextEntity !== entityAtStartSelection) {
    entitySelection = getEntitySelection(editorState, nextEntity);
    nextEntity = getEntityAtEndSelection(editorState, entitySelection);
  }

  const nextOffset = isBackDirection ? entitySelection.getAnchorOffset() : entitySelection.getFocusOffset();

  selection = selection.merge({ focusOffset: nextOffset, anchorOffset: nextOffset });

  editorState = EditorState.forceSelection(editorState, selection);

  return { nextOffset, selection, editorState };
};

const findAllNonSingleEntities = (content) => {
  const entitiesMap = {};
  const entitiesKeys = [];

  let entity;

  content.getBlockMap().forEach((block) => {
    block.findEntityRanges(
      (character) => {
        const entityKey = character.getEntity();

        entity = entityKey && content.getEntity(entityKey);

        return isXMLEntity(entity) && !entity.getData().isSingle;
      },
      (start, end) => {
        const data = entity.getData();

        entitiesKeys.push(data.key);
        entitiesMap[data.key] = { end, data, start };
      }
    );
  });

  return { entitiesMap, entitiesKeys };
};

const deleteUnlinkedEntities = ({
  content: prevContent,
  selection,
  entitiesMap,
  anchorOffset,
  entitiesKeys,
  adjustSelection: prevAdjustSelection,
}) => {
  let content = prevContent;
  let adjustEntity = 0;
  let adjustSelection = prevAdjustSelection;

  const deletedEntities = entitiesKeys.filter((key) => {
    const entity = entitiesMap[key];

    if (entitiesMap[entity.data.linkedKey]) {
      return false;
    }

    content = Modifier.removeRange(content, selection.merge({ focusOffset: entity.end - adjustEntity, anchorOffset: entity.start - adjustEntity }));
    const entityLength = entity.end - entity.start;

    adjustEntity += entityLength;

    if (entity.start < anchorOffset) {
      adjustSelection += entity.end <= anchorOffset ? entityLength : anchorOffset - entity.start;
    }

    return true;
  }, []);

  return {
    content,
    adjustSelection,
    deletedEntities,
  };
};

export default (store) => (newEditorState) => {
  let editorState = newEditorState;
  let selection = editorState.getSelection();
  let content = editorState.getCurrentContent();

  const anchorOffset = selection.getAnchorOffset();

  const isBackDirection = store.get('prevAnchorOffset') > anchorOffset;
  const entityAtStartSelection = getEntityAtStartSelection(editorState, selection, isBackDirection ? 0 : -1);

  if (!isBackDirection && selection.isCollapsed() && isXMLEntity(entityAtStartSelection) && anchorOffset !== 0) {
    let nextOffset;

    ({ nextOffset, selection, editorState } = selectTag({
      selection,
      editorState,
      isBackDirection,
      entityAtStartSelection,
    }));

    store.set('prevAnchorOffset', nextOffset);
  } else {
    store.set('prevAnchorOffset', anchorOffset);
  }

  const { entitiesMap, entitiesKeys } = findAllNonSingleEntities(content);

  let adjustSelection = 0;
  let deletedEntities;

  // eslint-disable-next-line prefer-const
  ({ content, adjustSelection, deletedEntities } = deleteUnlinkedEntities({
    content,
    selection,
    entitiesMap,
    entitiesKeys,
    anchorOffset,
    adjustSelection,
  }));

  if (deletedEntities.length) {
    const newAnchorOffset = anchorOffset - adjustSelection;

    if (newAnchorOffset === content.getPlainText().length) {
      content = Modifier.insertText(
        content,
        selection.merge({ focusOffset: anchorOffset - adjustSelection, anchorOffset: anchorOffset - adjustSelection }),
        ' '
      );
    }

    editorState = EditorState.forceSelection(
      EditorState.push(editorState, content, PushAction.APPLY_ENTITY),
      selection.merge({ focusOffset: anchorOffset - adjustSelection, anchorOffset: anchorOffset - adjustSelection })
    );
  }

  store.set('prevSelection', editorState.getSelection());

  return editorState;
};
