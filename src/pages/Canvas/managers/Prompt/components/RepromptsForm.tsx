import React from 'react';

import { NodeData, SpeakData } from '@/models';
import NoMatchItem from '@/pages/Canvas/components/NoMatchItem';
import SpeakAndAudioList from '@/pages/Canvas/components/SpeakAndAudioList';
import { NodeDataUpdater } from '@/pages/Canvas/types';
import { PlatformContext } from '@/pages/Skill/contexts';

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

  const changeRandomize = React.useCallback((randomize: boolean) => onChange({ noMatchReprompt: { randomize, reprompts } }), [reprompts]);
  const changeReprompts = React.useCallback((reprompts: SpeakData[]) => onChange({ noMatchReprompt: { randomize, reprompts } }), [randomize]);

  return (
    <SpeakAndAudioList
      items={reprompts}
      platform={platform}
      itemName="reprompts"
      maxItems={MAX_REPROMPTS}
      randomize={randomize}
      itemComponent={NoMatchItem}
      onChangeItems={changeReprompts}
      onChangeRandomize={changeRandomize}
    />
  );
};

export default RepromptsForm;
