import cuid from 'cuid';
import React from 'react';

import DraggableList, { DeleteComponent } from '@/componentsV2/DraggableList';
import OverflowMenu from '@/componentsV2/OverflowMenu';
import { DialogType } from '@/constants';
import { focusedNodeSelector } from '@/ducks/creator';
import { activePlatformSelector } from '@/ducks/skill';
import { connect } from '@/hocs';
import { useManager, useToggle } from '@/hooks';
import { Content, Controls, MaxOptionsMessage } from '@/pages/Canvas/components/Editor/components';

import AudioIcon from './components/AudioIcon';
import DraggableItem from './components/DraggableItem';

const MAX_EXPRESSIONS = 22;

const speakFactory = (type) => ({
  id: cuid.slug(),
  type,
  open: true,
  ...(type === DialogType.VOICE ? { voice: 'Alexa', content: '' } : { url: '' }),
});

function SpeakEditor({ data, platform, onChange }) {
  const [isDragging, toggleDragging] = useToggle(false);
  const toggleRandomized = React.useCallback(() => onChange({ randomize: !data.randomize }), [data.randomize, onChange]);
  const updateDialogs = React.useCallback((dialogs) => onChange({ dialogs }), [onChange]);

  const { items, onAdd, onRemove, mapManaged, onReorder, latestCreatedKey } = useManager(data.dialogs, updateDialogs, { factory: speakFactory });

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

  return (
    <Content
      footer={({ scrollToBottom }) =>
        items.length < MAX_EXPRESSIONS ? (
          <Controls
            menu={
              <OverflowMenu
                placement="top-end"
                options={[
                  {
                    label: data.randomize ? 'Unrandomize outputs' : 'Randomize outputs',
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
              },
              {
                label: 'Audio',
                icon: AudioIcon,
                onClick: () => addAudio(scrollToBottom),
              },
            ]}
          />
        ) : (
          <MaxOptionsMessage>Maximum options reached</MaxOptionsMessage>
        )
      }
      hideFooter={isDragging}
    >
      <DraggableList
        type="speak-editor"
        items={items}
        onDelete={onRemove}
        onReorder={onReorder}
        onEndDrag={toggleDragging}
        itemProps={{ platform, latestCreatedKey, isOnlyItem: items.length === 1, isRandomized: !!data.randomize }}
        mapManaged={mapManaged}
        onStartDrag={toggleDragging}
        itemComponent={DraggableItem}
        deleteComponent={DeleteComponent}
        partialDragItem
        previewComponent={DraggableItem}
      />
    </Content>
  );
}

const mapStateToProps = {
  platform: activePlatformSelector,
  focusedNode: focusedNodeSelector,
};

export default connect(mapStateToProps)(SpeakEditor);
