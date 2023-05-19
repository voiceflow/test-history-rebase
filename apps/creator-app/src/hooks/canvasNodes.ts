import { usePersistFunction } from '@voiceflow/ui';

import { useProjectAIPlayground } from '@/components/GPT/hooks/feature';
import { IS_PRIVATE_CLOUD } from '@/config';
import { BlockType } from '@/constants';

export const useCanvasNodeFilter = () => {
  const aiPlaygroundEnabled = useProjectAIPlayground();

  return usePersistFunction(<T extends { type: BlockType; publicOnly?: boolean }>(node: T) => {
    if (IS_PRIVATE_CLOUD && node.publicOnly) return false;
    if (!aiPlaygroundEnabled && [BlockType.AI_RESPONSE, BlockType.AI_SET].includes(node.type)) return false;
    return true;
  });
};
