import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { IS_PRIVATE_CLOUD } from '@/config';
import { BlockType } from '@/constants';

import { useFeature } from './feature';

export const useCanvasNodeFilter = () => {
  const gadgets = useFeature(Realtime.FeatureFlag.GADGETS);
  const promptStep = useFeature(Realtime.FeatureFlag.PROMPT_STEP);
  const generativeStep = useFeature(Realtime.FeatureFlag.GPT_GENERATIVE_RESPONSE);

  return React.useCallback(
    <T extends { type: BlockType; publicOnly?: boolean }>(node: T) => {
      if (!gadgets.isEnabled && node.type === BlockType.EVENT) return false;
      if (IS_PRIVATE_CLOUD && node.publicOnly) return false;
      if (!promptStep.isEnabled && node.type === BlockType.PROMPT) return false;
      if (!generativeStep.isEnabled && node.type === BlockType.GENERATIVE) return false;
      return true;
    },
    [gadgets, promptStep]
  );
};
