import cuid from 'cuid';
import React from 'react';

import DraggableList, { DeleteComponent } from '@/components/DraggableList';
import OverflowMenu from '@/components/OverflowMenu';
import { DialogType, PlatformType } from '@/constants';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { useManager, useToggle } from '@/hooks';
import { SpeakData } from '@/models';
import { Content, Controls } from '@/pages/Canvas/components/Editor';
import AudioIcon from '@/pages/Canvas/components/SpeakItem/AudioIcon';
import { ConnectedProps } from '@/types';
import { getPlatformDefaultVoice } from '@/utils/platform';

const speakItemFactory = ({ defaultVoice }: { defaultVoice: string }) => (type: DialogType) => ({
  type,
  id: cuid.slug(),
  open: true,
  ...(type === DialogType.VOICE ? { voice: defaultVoice, content: '' } : { url: '', desc: '' }),
});

export type SpeakItemListProps = {
  platform: PlatformType;
  changeRandomize: (newRandomize: boolean) => void;
  changeSpeakItems: (newReprompts: SpeakData[]) => void;
  itemComponent: React.FC<any>;
  maxItems: number;
  speakItems: SpeakData[];
  randomize: boolean;
  itemName?: string;
};

type FooterArgs = {
  scrollToBottom: (behavior: string) => void;
};

const SpeakItemList = ({
  platform,
  changeRandomize,
  changeSpeakItems,
  itemComponent,
  maxItems,
  speakItems,
  defaultVoice,
  randomize,
  itemName = 'outputs',
}: SpeakItemListProps & ConnectedSpeakItemListProps) => {
  const [isDragging, toggleDragging] = useToggle(false);
  const toggleRandomized = React.useCallback(() => changeRandomize(!randomize), [randomize, changeRandomize]);
  const updateSpeakItems = React.useCallback((newReprompts) => changeSpeakItems(newReprompts), [changeSpeakItems]);

  const { items, onAdd, onRemove, mapManaged, onReorder, latestCreatedKey } = (useManager as any)(speakItems, updateSpeakItems, {
    factory: speakItemFactory({ defaultVoice: defaultVoice || getPlatformDefaultVoice(platform) }),
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
            <OverflowMenu
              placement="top-end"
              options={[
                {
                  label: randomize ? `Unrandomize ${itemName}` : `Randomize ${itemName}`,
                  onClick: toggleRandomized,
                },
              ]}
            />
          }
          options={[
            {
              label: 'System',
              icon: 'alexa',
              onClick: () => addVoice(scrollToBottom),
              disabled: isMaxMatches,
            },
            {
              label: 'Audio',
              icon: AudioIcon,
              onClick: () => addAudio(scrollToBottom),
              disabled: isMaxMatches,
            },
          ]}
        />
      )}
      hideFooter={isDragging}
    >
      <DraggableList
        type="speak-editor"
        items={items}
        onDelete={onRemove}
        onReorder={onReorder}
        onEndDrag={toggleDragging}
        itemProps={{ platform, latestCreatedKey, isOnlyItem: items.length === 1, isRandomized: randomize }}
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
  defaultVoice: Skill.defaultVoiceSelector,
};

type ConnectedSpeakItemListProps = ConnectedProps<typeof mapStateToProps, {}>;

export default connect(mapStateToProps)(SpeakItemList) as React.FC<SpeakItemListProps>;
