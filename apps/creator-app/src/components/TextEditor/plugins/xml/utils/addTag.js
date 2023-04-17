import { EditorState, Modifier, SelectionState } from 'draft-js';

import { EntityType, Mutability, PushAction } from '../../constants';
import { findEntitiesAndRangesAtSelection } from '../../utils';
import getOpenTagText from './getOpenTagText';

const createOpenTag = (prevContent, { tag, isSingle, attributes }) => {
  const text = getOpenTagText(tag, isSingle, attributes);

  let content = prevContent.createEntity(EntityType.XML_OPEN_TAG, Mutability.IMMUTABLE, {
    key: null,
    tag,
    text,
    isSingle,
    linkedKey: null,
    attributes,
  });

  const key = content.getLastCreatedEntityKey();

  content = content.mergeEntityData(key, { key });

  return {
    key,
    text,
    content,
  };
};

const createCloseTag = (prevContent, { tag, openTagKey }) => {
  const text = `</${tag}>`;

  let content = prevContent.createEntity(EntityType.XML_CLOSE_TAG, Mutability.IMMUTABLE, {
    key: null,
    tag,
    text,
    linkedKey: openTagKey,
  });

  const key = content.getLastCreatedEntityKey();

  content = content.mergeEntityData(key, { key });
  content = content.mergeEntityData(openTagKey, { linkedKey: key });

  return {
    key,
    text,
    content,
  };
};

const insertSingleTag = ({ tag, store, attributes }) => {
  const selection = store.get('prevSelection');
  let editorState = store.getEditorState();

  // eslint-disable-next-line prefer-const
  let { key: openTagKey, text: openTagText, content } = createOpenTag(editorState.getCurrentContent(), { tag, isSingle: true, attributes });

  content = Modifier.replaceText(content, selection, openTagText, null, openTagKey);

  editorState = EditorState.push(editorState, content, PushAction.INSERT_CHARACTERS);

  return editorState;
};

const insertTagInCollapsedSelection = ({ tag, store, attributes }) => {
  let selection = store.get('prevSelection');
  let editorState = store.getEditorState();

  // eslint-disable-next-line prefer-const
  let { key: openTagKey, text: openTagText, content } = createOpenTag(editorState.getCurrentContent(), { tag, isSingle: false, attributes });

  content = Modifier.insertText(content, selection, openTagText, null, openTagKey);
  editorState = EditorState.push(editorState, content, PushAction.INSERT_CHARACTERS);

  selection = editorState.getSelection();
  content = Modifier.insertText(content, selection, '  ');
  editorState = EditorState.push(editorState, content, PushAction.INSERT_CHARACTERS);

  let closeTagKey;
  let closeTagText;
  // eslint-disable-next-line prefer-const
  ({ key: closeTagKey, text: closeTagText, content } = createCloseTag(content, { tag, openTagKey }));

  selection = editorState.getSelection();

  const selectionBeforeCloseTag = selection;

  content = Modifier.insertText(content, selection, closeTagText, null, closeTagKey);

  editorState = EditorState.push(editorState, content, PushAction.INSERT_CHARACTERS);

  editorState = EditorState.forceSelection(
    editorState,
    selectionBeforeCloseTag.merge({
      focusOffset: selectionBeforeCloseTag.getFocusOffset() - 1,
      anchorOffset: selectionBeforeCloseTag.getAnchorOffset() - 1,
    })
  );

  return editorState;
};

const findOpenedClosedEntities = (entitiesAtSelection) => {
  const openEntities = [];
  const closeEntities = [];

  entitiesAtSelection.forEach((data) => {
    const type = data.entity.getType();
    const { tag, isSingle } = data.entity.getData();

    if (type === EntityType.XML_OPEN_TAG && isSingle) {
      return;
    }

    if (type === EntityType.XML_OPEN_TAG) {
      openEntities.push(data);
    } else if (type === EntityType.XML_CLOSE_TAG && openEntities[openEntities.length - 1]?.entity.getData().tag === tag) {
      openEntities.pop();
    } else {
      closeEntities.push(data);
    }
  });

  return { openEntities, closeEntities };
};

const insertBetweenClosedTags = ({
  tag,
  adjust: prevAdjust,
  content: prevContent,
  selection: prevSelection,
  attributes,
  startOffset: prevStartOffset,
  closeEntities,
}) => {
  let adjust = prevAdjust;
  let content = prevContent;
  let selection = prevSelection;
  let startOffset = prevStartOffset;

  let openTagKey;
  let openTagText;
  let closeTagKey;
  let closeTagText;

  closeEntities.forEach(({ end, start }) => {
    ({ key: openTagKey, text: openTagText, content } = createOpenTag(content, { tag, isSingle: false, attributes }));

    selection = selection.merge({ focusOffset: startOffset, anchorOffset: startOffset });

    content = Modifier.insertText(content, selection, openTagText, null, openTagKey);

    adjust += openTagText.length;

    selection = selection.merge({ focusOffset: start + adjust, anchorOffset: start + adjust });

    ({ key: closeTagKey, text: closeTagText, content } = createCloseTag(content, { tag, openTagKey }));

    content = Modifier.insertText(content, selection, closeTagText, null, closeTagKey);

    adjust += closeTagText.length;

    startOffset = end + adjust;
  });

  return {
    adjust,
    content,
    selection,
    startOffset,
  };
};

const insertBetweenClosedAndOpenedTags = ({
  tag,
  adjust: prevAdjust,
  content: prevContent,
  selection: prevSelection,
  endOffset,
  attributes,
  startOffset: prevStartOffset,
  openEntities,
}) => {
  let adjust = prevAdjust;
  let content = prevContent;
  let selection = prevSelection;
  let startOffset = prevStartOffset;

  let openTagKey;
  let openTagText;
  let closeTagKey;
  let closeTagText;

  const { start } = openEntities[0] || { start: endOffset };

  // eslint-disable-next-line prefer-const
  ({ key: openTagKey, text: openTagText, content } = createOpenTag(content, { tag, isSingle: false, attributes }));

  selection = selection.merge({ focusOffset: startOffset, anchorOffset: startOffset });

  content = Modifier.insertText(content, selection, openTagText, null, openTagKey);

  adjust += openTagText.length;

  selection = selection.merge({ focusOffset: start + adjust, anchorOffset: start + adjust });

  // eslint-disable-next-line prefer-const
  ({ key: closeTagKey, text: closeTagText, content } = createCloseTag(content, { tag, openTagKey }));

  content = Modifier.insertText(content, selection, closeTagText, null, closeTagKey);

  adjust += closeTagText.length;

  startOffset = start + adjust;

  return {
    adjust,
    content,
    selection,
    startOffset,
  };
};

const insertBetweenOpenedTags = ({
  tag,
  adjust: prevAdjust,
  content: prevContent,
  selection: prevSelection,
  endOffset,
  attributes,
  openEntities,
}) => {
  let adjust = prevAdjust;
  let content = prevContent;
  let selection = prevSelection;

  let openTagKey;
  let openTagText;
  let closeTagKey;
  let closeTagText;

  openEntities.forEach(({ end }, i) => {
    ({ key: openTagKey, text: openTagText, content } = createOpenTag(content, { tag, isSingle: false, attributes }));

    selection = selection.merge({ focusOffset: end + adjust, anchorOffset: end + adjust });

    content = Modifier.insertText(content, selection, openTagText, null, openTagKey);

    adjust += openTagText.length;

    const { start: nextStart } = openEntities[i + 1] || { start: endOffset };

    selection = selection.merge({ focusOffset: nextStart + adjust, anchorOffset: nextStart + adjust });

    ({ key: closeTagKey, text: closeTagText, content } = createCloseTag(content, { tag, openTagKey }));

    content = Modifier.insertText(content, selection, closeTagText, null, closeTagKey);

    adjust += closeTagText.length;
  });

  return {
    adjust,
    content,
    selection,
  };
};

const insertTagInSelection = ({ tag, store, attributes }) => {
  let selection = store.get('prevSelection');
  let editorState = store.getEditorState();
  let content = editorState.getCurrentContent();

  const entitiesAtSelection = findEntitiesAndRangesAtSelection(editorState, selection, [EntityType.XML_OPEN_TAG, EntityType.XML_CLOSE_TAG]);

  const { openEntities, closeEntities } = findOpenedClosedEntities(entitiesAtSelection);

  const blockKey = selection.getFocusKey();
  const endOffset = selection.getEndOffset();

  let adjust = 0;
  let startOffset = selection.getStartOffset();

  selection = SelectionState.createEmpty(blockKey);

  ({ adjust, content, selection, startOffset } = insertBetweenClosedTags({
    tag,
    adjust,
    content,
    selection,
    attributes,
    startOffset,
    closeEntities,
  }));

  ({ adjust, content, selection, startOffset } = insertBetweenClosedAndOpenedTags({
    tag,
    adjust,
    content,
    selection,
    endOffset,
    attributes,
    startOffset,
    openEntities,
  }));

  ({ adjust, content, selection } = insertBetweenOpenedTags({
    tag,
    adjust,
    content,
    selection,
    endOffset,
    attributes,
    openEntities,
  }));

  editorState = EditorState.push(editorState, content, PushAction.INSERT_CHARACTERS);

  return editorState;
};

export default (store, tags, { tag, attributes }) => {
  if (tags[tag].isSingle) {
    store.setEditorState(insertSingleTag({ tag, store, attributes }));
  } else if (store.get('prevSelection').isCollapsed()) {
    store.setEditorState(insertTagInCollapsedSelection({ tag, store, attributes }));
  } else {
    store.setEditorState(insertTagInSelection({ tag, store, attributes }));
  }
};
