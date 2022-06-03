import * as Realtime from '@voiceflow/realtime-sdk';
import { SectionV2 } from '@voiceflow/ui';
import React from 'react';

import DraggableList from '@/components/DraggableList';
import { useManager } from '@/hooks';
import { NodeEditorV2Props } from '@/pages/Canvas/managers/types';

import { buttonFactory, PATH } from './constants';
import DraggableItem from './DraggableItem';

interface CarouselEditorButtonsSectionProps {
  cardID: string;
  editor: NodeEditorV2Props<Realtime.NodeData.Carousel, Realtime.NodeData.CarouselBuiltInPorts>;
  buttons: Realtime.NodeData.Carousel.Button[];
  onUpdate: (value: Partial<Realtime.NodeData.Carousel.Card>) => void;
}

const CarouselEditorButtonsSection: React.FC<CarouselEditorButtonsSectionProps> = ({ editor, buttons, onUpdate }) => {
  const onAddNew = () => {
    const newButton = buttonFactory();
    onUpdate({
      buttons: [...buttons, newButton],
    });

    editor.engine.port.addByKey(editor.nodeID, newButton.id);
    editor.goToNested({ state: { waitForData: true }, path: PATH, params: { buttonID: newButton.id } });
  };

  const onChange = (newButtons: Realtime.NodeData.Carousel.Button[]) => {
    onUpdate({ buttons: newButtons });
  };

  const onRemove = (button: Realtime.NodeData.Carousel.Button) => {
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

export default CarouselEditorButtonsSection;
