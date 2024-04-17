import * as Realtime from '@voiceflow/realtime-sdk';
import { usePersistFunction } from '@voiceflow/ui';

import { useProjectAIPlayground } from '@/components/GPT/hooks/feature';
import { IS_PRIVATE_CLOUD } from '@/config';
import { BlockType } from '@/constants';

import { useFeature } from './feature';

export const useCanvasNodeFilter = () => {
  const aiPlaygroundEnabled = useProjectAIPlayground();
  const { isEnabled: isFunctionsCmsEnabled } = useFeature(Realtime.FeatureFlag.CMS_FUNCTIONS);
  const { isEnabled: isAICaptureEnabled } = useFeature(Realtime.FeatureFlag.AI_CAPTURE);

  return usePersistFunction(<T extends { type: BlockType; publicOnly?: boolean }>(node: T) => {
    if (IS_PRIVATE_CLOUD && node.publicOnly) return false;
    if (!aiPlaygroundEnabled && [BlockType.AI_RESPONSE, BlockType.AI_SET, BlockType.AI_CAPTURE].includes(node.type)) return false;
    if (!isAICaptureEnabled && node.type === BlockType.AI_CAPTURE) return false;
    if (!isFunctionsCmsEnabled && node.type === BlockType.FUNCTION) return false;
    return true;
  });
};
