import { Constants } from '@voiceflow/general-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { MAX_ALEXA_REPROMPTS, MAX_SPEAK_ITEMS_COUNT } from '@/constants';
import SpeakAudioList from '@/pages/Canvas/components/SpeakAudioList';
import { isAnyGeneralPlatform } from '@/utils/typeGuards';

import { VoiceNoMatchItem } from './NoMatchItem';

interface VoiceNoMatchListProps extends Realtime.NodeData.VoiceNoMatches {
  platform: Constants.PlatformType;
  onChangeReprompts: (reprompts: Realtime.NodeData.VoiceNoMatches['reprompts']) => void;
  onChangeRandomize: (randomize: Realtime.NodeData.VoiceNoMatches['randomize']) => void;
}

const VoiceNoMatchList: React.FC<VoiceNoMatchListProps> = ({ reprompts, platform, randomize, children, onChangeReprompts, onChangeRandomize }) => {
  const items = React.useMemo(() => Realtime.Adapters.voiceRepromptToSpeakDataAdapter.mapFromDB(reprompts), []);

  const onChangeItems = React.useCallback(
    (items: Realtime.SpeakData[]) => onChangeReprompts(Realtime.Adapters.voiceRepromptToSpeakDataAdapter.mapToDB(items)),
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
