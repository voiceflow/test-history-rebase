import { FAKE_SELECTION_ENTITY } from '@voiceflow/draft-js-fake-selection';

import { Markup } from '@/models';

import { createBlockAdapter } from './utils';

const markupText = createBlockAdapter<Markup.NodeData.Text, Markup.NodeData.Text>(
  (data) => data,
  (data) => {
    const { content } = data;
    const entityMap: typeof content.entityMap = {};
    const entityKeysMap: Record<string, number> = {};

    const nonFakeSelectionEntityKeys = Object.keys(content.entityMap).filter((key) => content.entityMap[key].type !== FAKE_SELECTION_ENTITY);

    nonFakeSelectionEntityKeys.forEach((key, index) => {
      entityKeysMap[key] = index;
      entityMap[index] = content.entityMap[key];
    });

    content.blocks.forEach((block) => {
      block.entityRanges = block.entityRanges.reduce((acc, entityRange) => {
        if (entityKeysMap[entityRange.key] !== undefined) {
          return [...acc, { ...entityRange, key: entityKeysMap[entityRange.key] }];
        }

        return acc;
      }, [] as typeof block.entityRanges);
    });

    return {
      ...data,
      content: { ...content, entityMap },
    };
  }
);

export default markupText;
