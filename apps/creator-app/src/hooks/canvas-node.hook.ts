/* eslint-disable sonarjs/prefer-single-boolean-return */
import * as Realtime from '@voiceflow/realtime-sdk';
import { usePersistFunction } from '@voiceflow/ui';

import { useProjectAIPlayground } from '@/components/GPT/hooks/feature';
import { IS_PRIVATE_CLOUD } from '@/config';
import { BlockType } from '@/constants';

import { useFeature } from './feature';

export const useCanvasNodeFilter = () => {
  const aiPlaygroundEnabled = useProjectAIPlayground();

  const cmsFunctions = useFeature(Realtime.FeatureFlag.CMS_FUNCTIONS);
  const cmsResponses = useFeature(Realtime.FeatureFlag.CMS_RESPONSES);

  return usePersistFunction(<T extends { type: BlockType; publicOnly?: boolean }>(node: T) => {
    if (IS_PRIVATE_CLOUD && node.publicOnly) return false;
    if (!aiPlaygroundEnabled && [BlockType.AI_RESPONSE, BlockType.AI_SET].includes(node.type)) return false;
    if (node.type === BlockType.INTENT || node.type === BlockType.TRIGGER) return false;
    if (!cmsFunctions.isEnabled && node.type === BlockType.FUNCTION) return false;
    if (!cmsResponses.isEnabled && node.type === BlockType.RESPONSE) return false;

    return true;
  });
};
