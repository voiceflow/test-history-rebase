import { ElseType as InteractionElseType } from '@voiceflow/general-types/build/nodes/interaction';
import React from 'react';

import { NodeData, SpeakData } from '@/models';

const useCachedUpdate = (
  onChange: (newState: Partial<NodeData.Interaction>) => any,
  type: InteractionElseType,
  randomize: boolean,
  reprompts: SpeakData[]
) => {
  const cachedData = {
    else: {
      type,
      randomize,
      data: {
        reprompts,
      },
    },
  };
  const [cachedReprompts, changeReprompts] = React.useState(reprompts);
  const [cachedType, changeType] = React.useState(type);
  const [cachedRandomize, changeRandomize] = React.useState(randomize);

  React.useMemo(() => {
    onChange({
      else: {
        type: cachedType,
        randomize: cachedRandomize,
        reprompts: cachedReprompts,
      },
    });
  }, [cachedReprompts, cachedType, cachedRandomize]);

  return {
    cachedData,
    changeReprompts,
    changeType,
    changeRandomize,
  };
};

export default useCachedUpdate;
