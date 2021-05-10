import {
  BlockType,
  DIAGRAM_REFERENCE_NODES,
  INTERNAL_NODES,
  MARKUP_AND_COMBINED_NODES,
  MARKUP_NODES,
  ROOT_AND_MARKUP_NODES,
  ROOT_NODES,
} from '@/constants';

const createBlockTypeGuard = <R extends BlockType>(nodes: ReadonlyArray<R>) => (type: BlockType): type is R => nodes.includes(type as R);

export const isRootBlockType = createBlockTypeGuard(ROOT_NODES);
export const isMarkupBlockType = createBlockTypeGuard(MARKUP_NODES);
export const isInternalBlockType = createBlockTypeGuard(INTERNAL_NODES);
export const isRootOrMarkupBlockType = createBlockTypeGuard(ROOT_AND_MARKUP_NODES);
export const isMarkupOrCombinedBlockType = createBlockTypeGuard(MARKUP_AND_COMBINED_NODES);
export const isDiagramReferencesBlockType = createBlockTypeGuard(DIAGRAM_REFERENCE_NODES);
