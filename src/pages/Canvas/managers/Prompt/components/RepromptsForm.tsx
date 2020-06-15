import React from 'react';

import { NodeData } from '@/models';
import NoMatchItem from '@/pages/Canvas/components/NoMatchItem';
import SpeakItemList from '@/pages/Canvas/components/SpeakItemList';
import { PlatformContext } from '@/pages/Canvas/contexts';
import { NodeDataUpdater } from '@/pages/Canvas/types';

const MAX_REPROMPTS = 3;

export type RepromptsFormProps = {
  data: NodeData.Prompt;
  onChange: NodeDataUpdater<NodeData.Prompt>;
};

const RepromptsForm: React.FC<RepromptsFormProps> = ({ data, onChange }) => {
  const {
    noMatchReprompt: { randomize, reprompts },
  } = data;

  const platform = React.useContext(PlatformContext)!;

  const changeRandomize = React.useCallback((randomize) => onChange({ noMatchReprompt: { randomize, reprompts } }), [reprompts]);
  const changeReprompts = React.useCallback((reprompts) => onChange({ noMatchReprompt: { randomize, reprompts } }), [randomize]);

  return (
    <SpeakItemList
      platform={platform}
      changeRandomize={changeRandomize}
      changeSpeakItems={changeReprompts}
      itemComponent={NoMatchItem}
      maxItems={MAX_REPROMPTS}
      speakItems={reprompts}
      randomize={randomize}
      itemName="reprompts"
    />
  );
};

export default RepromptsForm;
