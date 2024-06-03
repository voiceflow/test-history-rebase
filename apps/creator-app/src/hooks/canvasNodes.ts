import * as Realtime from '@voiceflow/realtime-sdk';
import { usePersistFunction } from '@voiceflow/ui';

import { useProjectAIPlayground } from '@/components/GPT/hooks/feature';
import { IS_PRIVATE_CLOUD } from '@/config';
import { BlockType } from '@/constants';
import { Diagram } from '@/ducks';
import { useSelector } from '@/hooks/store.hook';

import { useFeature } from './feature';

export const useCanvasNodeFilter = () => {
  const isTopic = useSelector(Diagram.active.isTopicSelector);
  const aiPlaygroundEnabled = useProjectAIPlayground();

  const triggerStep = useFeature(Realtime.FeatureFlag.TRIGGER_STEP);
  const cmsFunctions = useFeature(Realtime.FeatureFlag.CMS_FUNCTIONS);

  return usePersistFunction(<T extends { type: BlockType; publicOnly?: boolean }>(node: T) => {
    if (IS_PRIVATE_CLOUD && node.publicOnly) return false;
    if (!aiPlaygroundEnabled && [BlockType.AI_RESPONSE, BlockType.AI_SET].includes(node.type)) return false;
    if (triggerStep.isEnabled && (node.type === BlockType.INTENT || node.type === BlockType.TRIGGER)) return false;
    if (!triggerStep.isEnabled && !isTopic && node.type === BlockType.INTENT) return false;
    // eslint-disable-next-line sonarjs/prefer-single-boolean-return
    if (!cmsFunctions.isEnabled && node.type === BlockType.FUNCTION) return false;

    return true;
  });
};
