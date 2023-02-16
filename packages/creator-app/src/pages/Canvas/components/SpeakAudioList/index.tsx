import { Nullable, Utils } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import OverflowMenu from '@/components/OverflowMenu';
import { DialogType } from '@/constants';
import * as VersionV2 from '@/ducks/versionV2';
import { useSelector } from '@/hooks';
import { ControlOptions } from '@/pages/Canvas/components/Editor';
import ListEditorContent, { ListItemComponent } from '@/pages/Canvas/components/ListEditorContent';
import { AUDIO_MOCK_DATA, NODE_CONFIG, VOICE_MOCK_DATA } from '@/pages/Canvas/managers/Speak/constants';

export const speakFactory = ({ defaultVoice }: { defaultVoice: string }): Realtime.SpeakData => ({
  id: Utils.id.cuid.slug(),
  type: DialogType.VOICE,
  voice: defaultVoice,
  content: '',
});

export const audioFactory = (): Realtime.SpeakData => ({
  id: Utils.id.cuid.slug(),
  url: '',
  desc: '',
  type: DialogType.AUDIO,
});

const speakAudioFactory =
  ({ defaultVoice }: { defaultVoice: string }) =>
  (type: DialogType): Realtime.SpeakData =>
    type === DialogType.VOICE ? speakFactory({ defaultVoice }) : audioFactory();

interface ExtraItemProps {
  platform: Platform.Constants.PlatformType;
  isRandomized?: boolean;
  isDeprecated?: boolean;
}

export type ItemComponent = ListItemComponent<Realtime.SpeakData, ExtraItemProps>;

export interface SpeakAudioListProps extends React.PropsWithChildren {
  items: Realtime.SpeakData[];
  platform: Platform.Constants.PlatformType;
  maxItems: number;
  itemName?: string;
  randomize?: boolean;
  renderMenu?: Nullable<() => React.ReactNode>;
  isDeprecated?: boolean;
  itemComponent: ItemComponent;
  onChangeItems?: (items: Realtime.SpeakData[]) => void;
  getControlOptions?: (options: { addVoice: () => void; addAudio: () => void; isMaxReached: boolean }) => ControlOptions[];
  onChangeRandomize?: (newRandomize: boolean) => void;
}

const SpeakAudioList: React.FC<SpeakAudioListProps> = ({
  items,
  itemName = 'outputs',
  children,
  maxItems,
  platform,
  randomize,
  renderMenu,
  isDeprecated,
  onChangeItems,
  itemComponent,
  getControlOptions,
  onChangeRandomize,
}) => {
  const defaultVoice = useSelector(VersionV2.active.voice.defaultVoiceSelector);

  const updateItems = React.useCallback((newItems: Realtime.SpeakData[]) => onChangeItems?.(newItems), [onChangeItems]);
  const toggleRandomized = React.useCallback(() => onChangeRandomize?.(!randomize), [randomize, onChangeRandomize]);

  const factory = speakAudioFactory({ defaultVoice });

  return (
    <ListEditorContent
      type="speak-editor"
      items={items}
      footer={children}
      maxItems={maxItems}
      renderMenu={() =>
        renderMenu ? (
          renderMenu()
        ) : (
          <OverflowMenu
            placement="top-end"
            options={[
              {
                label: randomize ? `Unrandomize ${itemName}` : `Randomize ${itemName}`,
                onClick: toggleRandomized,
              },
            ]}
          />
        )
      }
      onChangeItems={updateItems}
      itemComponent={itemComponent}
      extraItemProps={{ isDeprecated, platform, isRandomized: randomize }}
      getControlOptions={(mapManaged, { scrollToBottom }) =>
        getControlOptions
          ? getControlOptions({
              addVoice: Utils.functional.chainVoidAsync(() => mapManaged.onAdd(factory(DialogType.VOICE)), scrollToBottom),
              addAudio: Utils.functional.chainVoidAsync(() => mapManaged.onAdd(factory(DialogType.AUDIO)), scrollToBottom),
              isMaxReached: mapManaged.isMaxReached,
            })
          : [
              {
                label: 'Speak',
                icon: NODE_CONFIG.getIcon?.(VOICE_MOCK_DATA),
                onClick: Utils.functional.chainVoidAsync(() => mapManaged.onAdd(factory(DialogType.VOICE)), scrollToBottom),
                disabled: mapManaged.isMaxReached,
              },
              {
                label: 'Audio',
                icon: NODE_CONFIG.getIcon?.(AUDIO_MOCK_DATA),
                onClick: Utils.functional.chainVoidAsync(() => mapManaged.onAdd(factory(DialogType.AUDIO)), scrollToBottom),
                disabled: mapManaged.isMaxReached,
              },
            ]
      }
    />
  );
};

export default SpeakAudioList;
