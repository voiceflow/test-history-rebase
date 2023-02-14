import * as Realtime from '@voiceflow/realtime-sdk';
import { usePersistFunction } from '@voiceflow/ui';

import { IS_PRIVATE_CLOUD } from '@/config';
import { BlockType } from '@/constants';
import * as Project from '@/ducks/projectV2';
import { useSelector } from '@/hooks/redux';

import { useFeature } from './feature';

export const useCanvasNodeFilter = () => {
  const gadgets = useFeature(Realtime.FeatureFlag.GADGETS);
  const promptStep = useFeature(Realtime.FeatureFlag.PROMPT_STEP);
  const generativeStepFF = useFeature(Realtime.FeatureFlag.GPT_GENERATIVE_RESPONSE);
  const generativeStepSettingEnabled = !!useSelector(Project.active.aiAssistSettings)?.generateStep;

  return usePersistFunction(<T extends { type: BlockType; publicOnly?: boolean }>(node: T) => {
    if (!gadgets.isEnabled && node.type === BlockType.EVENT) return false;
    if (IS_PRIVATE_CLOUD && node.publicOnly) return false;
    if (!promptStep.isEnabled && node.type === BlockType.PROMPT) return false;
    if (!generativeStepFF.isEnabled && node.type === BlockType.GENERATIVE) return false;
    if (!generativeStepSettingEnabled && node.type === BlockType.GENERATIVE) return false;
    return true;
  });
};
