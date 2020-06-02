import React from 'react';

import { ChoiceElseType } from '@/constants';
import { NodeData, SpeakData } from '@/models';

const useCachedUpdate = (
  onChange: (newState: Partial<NodeData.Interaction>) => any,
  type: ChoiceElseType,
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
