import { Adapters } from '@voiceflow/realtime-sdk';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { MAX_ALEXA_REPROMPTS, MAX_SPEAK_ITEMS_COUNT } from '@/constants';
import SpeakAudioList from '@/pages/Canvas/components/SpeakAudioList';
import { PlatformContext } from '@/pages/Project/contexts';
import { isAnyGeneralPlatform } from '@/utils/typeGuards';

import { VoiceListItem } from './ListItem';

export interface VoiceListProps {
  randomize: boolean;
  reprompts?: Realtime.NodeData.VoicePrompt[];
  onChangeReprompts: (reprompts: Realtime.NodeData.VoicePrompt[]) => void;
  onChangeRandomize: () => void;
}

const VoiceList: React.FC<VoiceListProps> = ({ reprompts, randomize, children, onChangeReprompts, onChangeRandomize }) => {
  const platform = React.useContext(PlatformContext)!;

  const items = React.useMemo(() => Adapters.voicePromptToSpeakDataAdapter.mapFromDB(reprompts ?? []), [reprompts]);

  const onChangeItems = React.useCallback(
    (items: Realtime.SpeakData[]) => onChangeReprompts(Adapters.voicePromptToSpeakDataAdapter.mapToDB(items)),
    [onChangeReprompts]
  );

  return (
    <SpeakAudioList
      items={items}
      platform={platform}
      maxItems={isAnyGeneralPlatform(platform) ? MAX_SPEAK_ITEMS_COUNT : MAX_ALEXA_REPROMPTS}
      itemName="reprompts"
      randomize={randomize}
      itemComponent={VoiceListItem}
      onChangeItems={onChangeItems}
      onChangeRandomize={onChangeRandomize}
    >
      {children}
    </SpeakAudioList>
  );
};

export default VoiceList;
