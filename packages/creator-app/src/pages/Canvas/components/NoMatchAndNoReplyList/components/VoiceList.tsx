import { Adapters } from '@voiceflow/realtime-sdk';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { MAX_ALEXA_REPROMPTS, MAX_SYSTEM_MESSAGES_COUNT } from '@/constants';
import SpeakAudioList from '@/pages/Canvas/components/SpeakAudioList';
import { PlatformContext } from '@/pages/Project/contexts';
import { isAlexaPlatform } from '@/utils/typeGuards';

import { NoMatchVoiceListItem, NoReplyVoiceListItem } from './ListItem';

export interface VoiceListProps {
  randomize: boolean;
  reprompts?: Realtime.NodeData.VoicePrompt[];
  isNoReply?: boolean;
  onChangeReprompts: (reprompts: Realtime.NodeData.VoicePrompt[]) => void;
  onChangeRandomize: () => void;
  hideRandomizeMenu?: boolean;
}

const VoiceList: React.FC<VoiceListProps> = ({
  reprompts,
  randomize,
  children,
  isNoReply,
  onChangeReprompts,
  onChangeRandomize,
  hideRandomizeMenu,
}) => {
  const platform = React.useContext(PlatformContext)!;

  const repromptsCache = React.useRef<Realtime.NodeData.VoicePrompt[]>(reprompts ?? []);
  const itemsCache = React.useRef<Realtime.SpeakData[]>([]);

  // useManager will reset if the object changes - causes flickering
  const items = React.useMemo(() => {
    const speakItems = Adapters.voicePromptToSpeakDataAdapter.mapFromDB(reprompts ?? []);

    if (repromptsCache.current === reprompts && speakItems.length === itemsCache.current.length) {
      return itemsCache.current;
    }

    return speakItems;
  }, [reprompts]);

  const onChangeItems = React.useCallback(
    (items: Realtime.SpeakData[]) => {
      itemsCache.current = items;
      repromptsCache.current = Adapters.voicePromptToSpeakDataAdapter.mapToDB(items);

      onChangeReprompts(repromptsCache.current);
    },
    [onChangeReprompts]
  );

  return (
    <SpeakAudioList
      items={items}
      platform={platform}
      maxItems={isAlexaPlatform(platform) ? MAX_ALEXA_REPROMPTS : MAX_SYSTEM_MESSAGES_COUNT}
      itemName="reprompts"
      randomize={randomize}
      renderMenu={hideRandomizeMenu ? () => null : null}
      itemComponent={isNoReply ? NoReplyVoiceListItem : NoMatchVoiceListItem}
      onChangeItems={onChangeItems}
      onChangeRandomize={onChangeRandomize}
    >
      {children}
    </SpeakAudioList>
  );
};

export default VoiceList;
