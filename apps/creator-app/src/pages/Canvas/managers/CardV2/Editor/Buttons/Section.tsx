import type * as Realtime from '@voiceflow/realtime-sdk';
import { SectionV2 } from '@voiceflow/ui';
import React from 'react';

import DraggableList from '@/components/DraggableList';
import { useMapManager } from '@/hooks';
import type { NodeEditorV2Props } from '@/pages/Canvas/managers/types';

import { buttonFactory, PATH } from './constants';
import DraggableItem from './DraggableItem';

interface CardV2EditorButtonsSectionProps {
  editor: NodeEditorV2Props<Realtime.NodeData.CardV2, Realtime.NodeData.CardV2BuiltInPorts>;
  buttons: Realtime.NodeData.CardV2.Button[];
  onUpdate: (value: Partial<Realtime.NodeData.CardV2>, save?: boolean | undefined) => Promise<void>;
}

const CardV2EditorButtonsSection: React.FC<CardV2EditorButtonsSectionProps> = ({ editor, buttons, onUpdate }) => {
  const mapManager = useMapManager(buttons, (buttons) => onUpdate({ buttons }), {
    factory: buttonFactory,

    onAdd: (button) => editor.engine.port.addByKey(editor.nodeID, button.id),
    onAdded: (button) =>
      editor.goToNested({ state: { waitForData: true }, path: PATH, params: { buttonID: button.id } }),
    onRemove: (button) =>
      editor.engine.port.removeManyByKey([{ key: button.id, portID: editor.node.ports.out.byKey[button.id] }]),
  });

  return (
    <SectionV2.ActionListSection
      title={<SectionV2.Title bold={!!buttons.length}>Buttons</SectionV2.Title>}
      action={<SectionV2.AddButton onClick={() => mapManager.onAdd()} />}
      contentProps={{ bottomOffset: 2 }}
    >
      {!!buttons.length && (
        <DraggableList
          type="cards-buttons-editor"
          itemProps={{ editor, latestCreatedKey: mapManager.latestCreatedKey }}
          mapManager={mapManager}
          itemComponent={DraggableItem}
          partialDragItem
          previewComponent={DraggableItem}
          contextMenuOptions={[
            {
              label: 'Rename',
              onClick: ({ item }) =>
                editor.goToNested({ path: PATH, state: { renaming: true }, params: { buttonID: item.id } }),
            },
          ]}
        />
      )}
    </SectionV2.ActionListSection>
  );
};

export default CardV2EditorButtonsSection;
