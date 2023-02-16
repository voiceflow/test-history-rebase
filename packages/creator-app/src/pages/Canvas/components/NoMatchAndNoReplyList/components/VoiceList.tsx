import * as Platform from '@voiceflow/platform-config';
import { Adapters } from '@voiceflow/realtime-sdk';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { MAX_ALEXA_REPROMPTS, MAX_SYSTEM_MESSAGES_COUNT } from '@/constants';
import { useActiveProjectPlatform } from '@/hooks';
import SpeakAudioList from '@/pages/Canvas/components/SpeakAudioList';
import { isAlexaPlatform } from '@/utils/typeGuards';

import { NoMatchVoiceListItem, NoReplyVoiceListItem } from './ListItem';

export interface VoiceListProps extends React.PropsWithChildren {
  randomize: boolean;
  reprompts?: Platform.Common.Voice.Models.Prompt.Model[];
  isNoReply?: boolean;
  onChangeReprompts: (reprompts: Platform.Common.Voice.Models.Prompt.Model[]) => void;
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
  const platform = useActiveProjectPlatform();

  const repromptsCache = React.useRef<Platform.Common.Voice.Models.Prompt.Model[]>(reprompts ?? []);
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
