import * as Realtime from '@voiceflow/realtime-sdk';
import { SectionV2 } from '@voiceflow/ui';
import React from 'react';

import DraggableList from '@/components/DraggableList';
import { useManager } from '@/hooks';
import { NodeEditorV2Props } from '@/pages/Canvas/managers/types';

import { buttonFactory, PATH } from './constants';
import DraggableItem from './DraggableItem';

export type ReorderButtonCallback = (from: number, to: number, button: Realtime.NodeData.CardV2.CardButton) => Promise<void>;
export type RemoveButtonCallback = (button: Realtime.NodeData.CardV2.CardButton) => Promise<void>;
export type AddButtonCallback = (cardID: string) => Promise<void>;

interface CardV2EditorButtonsSectionProps {
  cardID: string;
  editor: NodeEditorV2Props<Realtime.NodeData.CardV2, Realtime.NodeData.CardV2BuiltInPorts>;
  buttons: Realtime.NodeData.CardV2.CardButton[];
  onUpdate: (value: Partial<Realtime.NodeData.CardV2.Card>) => void;
}

const CardV2EditorButtonsSection: React.FC<CardV2EditorButtonsSectionProps> = ({ editor, buttons, onUpdate }) => {
  const onAddNew = () => {
    const newButton = buttonFactory();
    onUpdate({
      buttons: [...buttons, newButton],
    });

    editor.engine.port.addByKey(editor.nodeID, newButton.id);
    editor.goToNested({ state: { waitForData: true }, path: PATH, params: { buttonID: newButton.id } });
  };

  const onChange = (newButtons: Realtime.NodeData.CardV2.CardButton[]) => {
    onUpdate({ buttons: newButtons });
  };

  const onRemove = (button: Realtime.NodeData.CardV2.CardButton) => {
    const portID = editor.node.ports.out.byKey[button.id];
    editor.engine.port.removeByKey(button.id, portID);
  };

  const managerAPI = useManager(buttons, onChange, {
    factory: buttonFactory,
    autosave: false,
    onRemove,
  });

  return (
    <SectionV2.ActionListSection
      title={<SectionV2.Title bold={!!buttons.length}>Buttons</SectionV2.Title>}
      action={<SectionV2.AddButton onClick={onAddNew} />}
      contentProps={{ pb: 16 }}
    >
      {!!buttons.length && (
        <DraggableList
          type="cards-buttons-editor"
          onDelete={managerAPI.onRemove}
          onReorder={managerAPI.onReorder}
          itemProps={{ editor, latestCreatedKey: managerAPI.latestCreatedKey }}
          mapManaged={managerAPI.mapManaged}
          itemComponent={DraggableItem}
          partialDragItem
          previewComponent={DraggableItem}
        />
      )}
    </SectionV2.ActionListSection>
  );
};

export default CardV2EditorButtonsSection;
