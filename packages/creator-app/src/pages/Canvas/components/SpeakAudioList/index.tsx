import { Constants } from '@voiceflow/general-types';
import cuid from 'cuid';
import React from 'react';

import OverflowMenu from '@/components/OverflowMenu';
import { DialogType } from '@/constants';
import * as Version from '@/ducks/version';
import { connect } from '@/hocs';
import { SpeakData } from '@/models';
import { ControlOptions } from '@/pages/Canvas/components/Editor';
import ListEditorContent, { ListItemComponent } from '@/pages/Canvas/components/ListEditorContent';
import { AUDIO_MOCK_DATA, NODE_CONFIG, VOICE_MOCK_DATA } from '@/pages/Canvas/managers/Speak/constants';
import { ConnectedProps } from '@/types';
import { chainVoidAsync } from '@/utils/functional';
import { getPlatformDefaultVoice } from '@/utils/platform';

export const speakFactory = ({ defaultVoice }: { defaultVoice: string }): SpeakData => ({
  id: cuid.slug(),
  type: DialogType.VOICE,
  voice: defaultVoice,
  content: '',
});

export const audioFactory = (): SpeakData => ({
  id: cuid.slug(),
  url: '',
  desc: '',
  type: DialogType.AUDIO,
});

const speakAudioFactory =
  ({ defaultVoice }: { defaultVoice: string }) =>
  (type: DialogType): SpeakData =>
    type === DialogType.VOICE ? speakFactory({ defaultVoice }) : audioFactory();

export type ItemComponent = ListItemComponent<SpeakData, { platform: Constants.PlatformType; isRandomized?: boolean; isDeprecated?: boolean }>;

export interface SpeakAudioListProps {
  items: SpeakData[];
  platform: Constants.PlatformType;
  maxItems: number;
  itemName?: string;
  randomize?: boolean;
  renderMenu?: () => React.ReactNode;
  isDeprecated?: boolean;
  itemComponent: ItemComponent;
  onChangeItems?: (items: SpeakData[]) => void;
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
  const updateItems = React.useCallback((newItems: SpeakData[]) => onChangeItems?.(newItems), [onChangeItems]);

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
              addVoice: chainVoidAsync(() => onAdd(DialogType.VOICE), scrollToBottom),
              addAudio: chainVoidAsync(() => onAdd(DialogType.AUDIO), scrollToBottom),
              isMaxMatches,
            })
          : [
              {
                label: 'System',
                icon: NODE_CONFIG.getIcon!(VOICE_MOCK_DATA),
                onClick: chainVoidAsync(() => onAdd(DialogType.VOICE), scrollToBottom),
                disabled: isMaxMatches,
                iconProps: { color: NODE_CONFIG.getIconColor!(VOICE_MOCK_DATA) },
              },
              {
                label: 'Audio',
                icon: NODE_CONFIG.getIcon!(AUDIO_MOCK_DATA),
                onClick: chainVoidAsync(() => onAdd(DialogType.AUDIO), scrollToBottom),
                disabled: isMaxMatches,
                iconProps: { color: NODE_CONFIG.getIconColor!(AUDIO_MOCK_DATA) },
              },
            ]
      }
    />
  );
};

const mapStateToProps = {
  defaultVoice: Version.activeDefaultVoiceSelector,
};

type ConnectedSpeakAndAudioListProps = ConnectedProps<typeof mapStateToProps, {}>;

export default connect(mapStateToProps)(SpeakAudioList) as React.FC<SpeakAudioListProps>;
