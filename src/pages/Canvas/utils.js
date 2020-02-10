import moize from 'moize';

import { BlockType, NO_EDITOR_BLOCKS } from '@/constants';
import MANAGERS, { getManager } from '@/pages/Canvas/managers';

const CHAINABLE_BLOCKS = MANAGERS.filter(({ type }) => !NO_EDITOR_BLOCKS.includes(type));

// eslint-disable-next-line import/prefer-default-export
export const getNextSteps = moize((type) => {
  const { mergeTerminator } = getManager(type);

  if (mergeTerminator) {
    return [];
  }

  let managers = CHAINABLE_BLOCKS;
  if (type === BlockType.INTENT) {
    managers = managers.filter((manager) => manager.type !== BlockType.INTENT);
  }

  return managers.map((manager) => ({ label: manager.label, value: manager.type }));
});
