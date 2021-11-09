import { Utils } from '@voiceflow/common';
import { Constants } from '@voiceflow/general-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import OverflowMenu from '@/components/OverflowMenu';
import { DialogType } from '@/constants';
import * as VersionV2 from '@/ducks/versionV2';
import { connect } from '@/hocs';
import { ControlOptions } from '@/pages/Canvas/components/Editor';
import ListEditorContent, { ListItemComponent } from '@/pages/Canvas/components/ListEditorContent';
import { AUDIO_MOCK_DATA, NODE_CONFIG, VOICE_MOCK_DATA } from '@/pages/Canvas/managers/Speak/constants';
import { ConnectedProps } from '@/types';
import { getPlatformDefaultVoice } from '@/utils/platform';

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

export type ItemComponent = ListItemComponent<
  Realtime.SpeakData,
  { platform: Constants.PlatformType; isRandomized?: boolean; isDeprecated?: boolean }
>;

export interface SpeakAudioListProps {
  items: Realtime.SpeakData[];
  platform: Constants.PlatformType;
  maxItems: number;
  itemName?: string;
  randomize?: boolean;
  renderMenu?: () => React.ReactNode;
  isDeprecated?: boolean;
  itemComponent: ItemComponent;
  onChangeItems?: (items: Realtime.SpeakData[]) => void;
  getControlOptions?: (options: { addVoice: () => void; addAudio: () => void; isMaxMatches: boolean }) => ControlOptions[];
  onChangeRandomize?: (newRandomize: boolean) => void;
}

const SpeakAudioList = ({
  items,
  itemName = 'outputs',
  children,
  maxItems,
  platform,
  randomize,
  renderMenu,
  defaultVoice,
  isDeprecated,
  onChangeItems,
  itemComponent,
  getControlOptions,
  onChangeRandomize,
}: React.PropsWithChildren<SpeakAudioListProps> & ConnectedSpeakAndAudioListProps) => {
  const toggleRandomized = React.useCallback(() => onChangeRandomize?.(!randomize), [randomize, onChangeRandomize]);
  const updateItems = React.useCallback((newItems: Realtime.SpeakData[]) => onChangeItems?.(newItems), [onChangeItems]);

  const factory = React.useMemo(
    () => speakAudioFactory({ defaultVoice: defaultVoice || getPlatformDefaultVoice(platform) }),
    [defaultVoice, platform]
  );

  return (
    <ListEditorContent
      type="speak-editor"
      items={items}
      footer={children}
      factory={factory}
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
      getControlOptions={({ onAdd, isMaxMatches, scrollToBottom }) =>
        getControlOptions
          ? getControlOptions({
              addVoice: Utils.functional.chainVoidAsync(() => onAdd(DialogType.VOICE), scrollToBottom),
              addAudio: Utils.functional.chainVoidAsync(() => onAdd(DialogType.AUDIO), scrollToBottom),
              isMaxMatches,
            })
          : [
              {
                label: 'System',
                icon: NODE_CONFIG.getIcon!(VOICE_MOCK_DATA),
                onClick: Utils.functional.chainVoidAsync(() => onAdd(DialogType.VOICE), scrollToBottom),
                disabled: isMaxMatches,
                iconProps: { color: NODE_CONFIG.getIconColor!(VOICE_MOCK_DATA) },
              },
              {
                label: 'Audio',
                icon: NODE_CONFIG.getIcon!(AUDIO_MOCK_DATA),
                onClick: Utils.functional.chainVoidAsync(() => onAdd(DialogType.AUDIO), scrollToBottom),
                disabled: isMaxMatches,
                iconProps: { color: NODE_CONFIG.getIconColor!(AUDIO_MOCK_DATA) },
              },
            ]
      }
    />
  );
};

const mapStateToProps = {
  defaultVoice: VersionV2.active.defaultVoiceSelector,
};

type ConnectedSpeakAndAudioListProps = ConnectedProps<typeof mapStateToProps, {}>;

export default connect(mapStateToProps)(SpeakAudioList) as React.FC<SpeakAudioListProps>;
