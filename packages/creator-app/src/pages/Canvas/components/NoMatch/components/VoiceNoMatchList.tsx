import { PlatformType } from '@voiceflow/internal';
import { Adapters } from '@voiceflow/realtime-sdk';
import React from 'react';

import { MAX_ALEXA_REPROMPTS, MAX_SPEAK_ITEMS_COUNT } from '@/constants';
import { NodeData, SpeakData } from '@/models';
import SpeakAudioList from '@/pages/Canvas/components/SpeakAudioList';
import { isAnyGeneralPlatform } from '@/utils/typeGuards';

import { VoiceNoMatchItem } from './NoMatchItem';

interface VoiceNoMatchListProps extends NodeData.VoiceNoMatches {
  platform: PlatformType;
  onChangeReprompts: (reprompts: NodeData.VoiceNoMatches['reprompts']) => void;
  onChangeRandomize: (randomize: NodeData.VoiceNoMatches['randomize']) => void;
}

const VoiceNoMatchList: React.FC<VoiceNoMatchListProps> = ({ reprompts, platform, randomize, children, onChangeReprompts, onChangeRandomize }) => {
  const items = React.useMemo(() => Adapters.voiceRepromptToSpeakDataAdapter.mapFromDB(reprompts), []);

  const onChangeItems = React.useCallback(
    (items: SpeakData[]) => onChangeReprompts(Adapters.voiceRepromptToSpeakDataAdapter.mapToDB(items)),
    [onChangeReprompts]
  );

  return (
    <SpeakAudioList
      items={items}
      platform={platform}
      maxItems={isAnyGeneralPlatform(platform) ? MAX_SPEAK_ITEMS_COUNT : MAX_ALEXA_REPROMPTS}
      itemName="reprompts"
      randomize={randomize}
      itemComponent={VoiceNoMatchItem}
      onChangeItems={onChangeItems}
      onChangeRandomize={onChangeRandomize}
    >
      {children}
    </SpeakAudioList>
  );
};

export default VoiceNoMatchList;
