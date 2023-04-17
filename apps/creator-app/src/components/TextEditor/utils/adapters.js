import { convertFromRaw, convertToRaw, EditorState, genKey } from 'draft-js';

import { ENTITY_TYPE_PLUGIN_TYPE } from '../plugins';

const createRawState = (value, convertor) => {
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

export const toState = (value = '', convertor, prevEditorState) => {
  const content = convertFromRaw(createRawState(value, convertor));

  if (prevEditorState) {
    return EditorState.moveFocusToEnd(EditorState.moveSelectionToEnd(EditorState.push(prevEditorState, content)));
  }

  return EditorState.set(EditorState.createWithContent(content), { allowUndo: false });
};

export const fromState = (pluginsAdapters) => {
  const stateProcessor = ({ blocks = [], entityMap } = {}) => {
    const pluginsData = {};

    const text = blocks
      .flatMap(({ text, entityRanges }) => {
        if (!entityRanges.length) {
          return text;
        }

        let value = '';
        let cursor = 0;

        entityRanges.forEach(({ key, offset, length }) => {
          if (offset > cursor) {
            value += text.slice(cursor, offset);
          }

          const entity = entityMap[key];
          const pluginType = ENTITY_TYPE_PLUGIN_TYPE[entity.type];
          const pluginData = pluginsData[pluginType] || {};

          if (pluginsAdapters[pluginType]) {
            const { text: entityText, ...data } = pluginsAdapters[pluginType](entity.data, pluginData);

            pluginsData[pluginType] = data;

            value += entityText;
          } else {
            value += text.slice(cursor, offset);
          }

          cursor = offset + length;
        });

        if (cursor < text.length) {
          value += text.slice(cursor);
        }

        return value;
      })
      .join('');

    return { text, pluginsData };
  };

  return (state) => stateProcessor(convertToRaw(state.getCurrentContent()));
};
