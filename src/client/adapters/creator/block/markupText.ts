import { RawDraftContentState } from 'draft-js';

import { Markup } from '@/models';

import { createBlockAdapter } from './utils';

const cleanupContent = ({ blocks, entityMap }: RawDraftContentState): RawDraftContentState => {
  const blocksWithoutFakeSelection = blocks.map((block) => ({
    ...block,
    inlineStyleRanges: block.inlineStyleRanges.filter((style) => !style?.style?.includes('FAKE_SELECTION')),
  }));

  return {
    blocks: blocksWithoutFakeSelection,
    entityMap,
  };
};

const markupText = createBlockAdapter<Markup.NodeData.Text, Markup.NodeData.Text>(
  (data) => ({ ...data, content: cleanupContent(data.content) }),
  (data) => ({ ...data, content: cleanupContent(data.content) })
);

export default markupText;
