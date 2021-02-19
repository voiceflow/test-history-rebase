import { convertFromRaw, EditorState, genKey, Modifier } from 'draft-js';

const createRowState = (value, convertor) => {
  const cursor = 0;
  const blocks = [];
  const entityMap = {};
  const entityRanges = [];

  const text = convertor(value, { cursor, blocks, entityMap, entityRanges });

  return {
    text,
    blocks: [
      {
        key: genKey(),
        text,
        type: 'unstyled',
        depth: 0,
        entityRanges,
        inlineStyleRanges: [],
      },
    ],
    entityMap,
  };
};

export default (globalStore, fromPastedTextConvertor) => (store) => (text) => {
  const editorState = store.getEditorState();

  const pastedContent = convertFromRaw(createRowState(text, fromPastedTextConvertor(globalStore.get('pluginsProps'))));

  const nextContent = Modifier.replaceWithFragment(editorState.getCurrentContent(), editorState.getSelection(), pastedContent.getBlockMap());
  const nextEditorSTate = EditorState.push(editorState, nextContent, 'insert-fragment');

  store.setEditorState(nextEditorSTate);

  return {
    state: 'handled',
    editorState: nextEditorSTate,
  };
};
