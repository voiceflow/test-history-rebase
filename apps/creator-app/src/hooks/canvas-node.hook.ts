/* eslint-disable sonarjs/prefer-single-boolean-return */
import * as Realtime from '@voiceflow/realtime-sdk';
import { usePersistFunction } from '@voiceflow/ui';

import { useProjectAIPlayground } from '@/components/GPT/hooks/feature';
import { IS_PRIVATE_CLOUD } from '@/config';
import { BlockType } from '@/constants';

import { useFeature } from './feature.hook';

export const useCanvasNodeFilter = () => {
  const aiPlaygroundEnabled = useProjectAIPlayground();

  const cmsFunctions = useFeature(Realtime.FeatureFlag.CMS_FUNCTIONS);
  const cmsResponses = useFeature(Realtime.FeatureFlag.CMS_RESPONSES);
  const buttonsV2Step = useFeature(Realtime.FeatureFlag.BUTTONS_V2_STEP);

  // eslint-disable-next-line sonarjs/cognitive-complexity
  return usePersistFunction(<T extends { type: BlockType; publicOnly?: boolean }>(node: T) => {
    if (IS_PRIVATE_CLOUD && node.publicOnly) return false;
    if (!aiPlaygroundEnabled && [BlockType.AI_RESPONSE, BlockType.AI_SET].includes(node.type)) return false;
    if (node.type === BlockType.INTENT || node.type === BlockType.TRIGGER) return false;

    if (!buttonsV2Step && node.type === BlockType.BUTTONS_V2) return false;
    if (buttonsV2Step && node.type === BlockType.BUTTONS) return false;

    if (!cmsFunctions && node.type === BlockType.FUNCTION) return false;
    if (!cmsResponses && node.type === BlockType.MESSAGE) return false;

    return true;
  });
};
