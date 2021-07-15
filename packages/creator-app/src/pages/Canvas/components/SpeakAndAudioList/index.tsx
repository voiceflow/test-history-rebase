import cuid from 'cuid';
import React from 'react';

import DraggableList, {
  DeleteComponent,
  DragPreviewComponentProps,
  ItemComponentProps,
  MappedItemComponentHandlers,
} from '@/components/DraggableList';
import OverflowMenu from '@/components/OverflowMenu';
import { DialogType, PlatformType } from '@/constants';
import * as Version from '@/ducks/version';
import { connect } from '@/hocs';
import { useManager, useToggle } from '@/hooks';
import { SpeakData } from '@/models';
import { Content, ControlOptions, Controls } from '@/pages/Canvas/components/Editor';
import { AUDIO_MOCK_DATA, NODE_CONFIG, VOICE_MOCK_DATA } from '@/pages/Canvas/managers/Speak/constants';
import { ConnectedProps } from '@/types';
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

export type ItemExtraProps = DragPreviewComponentProps & {
  platform: PlatformType;
  isOnlyItem: boolean;
  isRandomized?: boolean;
  isDeprecated?: boolean;
  latestCreatedKey: string | undefined;
};

type ItemComponent = React.NamedExoticComponent<
  React.PropsWithoutRef<ItemComponentProps<SpeakData> & MappedItemComponentHandlers<SpeakData> & ItemExtraProps> & React.RefAttributes<HTMLElement>
>;

export interface SpeakAndAudioListProps {
  items: SpeakData[];
  platform: PlatformType;
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

type FooterArgs = {
  scrollToBottom: (behavior: string) => void;
};

const SpeakAndAudioList = ({
  items: speakAudioItems,
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
}: React.PropsWithChildren<SpeakAndAudioListProps> & ConnectedSpeakAndAudioListProps) => {
  const [isDragging, toggleDragging] = useToggle(false);
  const toggleRandomized = React.useCallback(() => onChangeRandomize?.(!randomize), [randomize, onChangeRandomize]);
  const updateItems = React.useCallback((items: SpeakData[]) => onChangeItems?.(items), [onChangeItems]);

  const { items, onAdd, onRemove, mapManaged, onReorder, latestCreatedKey } = useManager(speakAudioItems, updateItems, {
    factory: speakAudioFactory({ defaultVoice: defaultVoice || getPlatformDefaultVoice(platform) }),
  });

  const addVoice = React.useCallback(
    async (scrollToBottom) => {
      await onAdd(DialogType.VOICE);

      scrollToBottom();
    },
    [onAdd]
  );
  const addAudio = React.useCallback(
    async (scrollToBottom) => {
      await onAdd(DialogType.AUDIO);

      scrollToBottom();
    },
    [onAdd]
  );

  const isMaxMatches = items.length >= maxItems;

  return (
    <Content
      footer={({ scrollToBottom }: FooterArgs) => (
        <Controls
          menu={
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
          options={
            getControlOptions
              ? getControlOptions({ isMaxMatches, addVoice: () => addVoice(scrollToBottom), addAudio: () => addAudio(scrollToBottom) })
              : [
                  {
                    label: 'System',
                    icon: NODE_CONFIG.getIcon!(VOICE_MOCK_DATA),
                    onClick: () => addVoice(scrollToBottom),
                    disabled: isMaxMatches,
                    iconProps: { color: NODE_CONFIG.getIconColor!(VOICE_MOCK_DATA) },
                  },
                  {
                    label: 'Audio',
                    icon: NODE_CONFIG.getIcon!(AUDIO_MOCK_DATA),
                    onClick: () => addAudio(scrollToBottom),
                    disabled: isMaxMatches,
                    iconProps: { color: NODE_CONFIG.getIconColor!(AUDIO_MOCK_DATA) },
                  },
                ]
          }
        />
      )}
      hideFooter={isDragging}
    >
      <DraggableList
        type="speak-editor"
        footer={children}
        onDelete={onRemove}
        onReorder={onReorder}
        onEndDrag={toggleDragging}
        itemProps={{ isDeprecated, platform, latestCreatedKey, isOnlyItem: items.length === 1, isRandomized: randomize }}
        mapManaged={mapManaged}
        onStartDrag={toggleDragging}
        itemComponent={itemComponent}
        deleteComponent={DeleteComponent}
        partialDragItem
        previewComponent={itemComponent}
        withContextMenuDelete
      />
    </Content>
  );
};

const mapStateToProps = {
  defaultVoice: Version.activeDefaultVoiceSelector,
};

type ConnectedSpeakAndAudioListProps = ConnectedProps<typeof mapStateToProps, {}>;

export default connect(mapStateToProps)(SpeakAndAudioList) as React.FC<SpeakAndAudioListProps>;
