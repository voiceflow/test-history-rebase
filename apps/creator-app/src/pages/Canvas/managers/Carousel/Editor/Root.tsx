import type * as Realtime from '@voiceflow/realtime-sdk';
import { Button, usePersistFunction } from '@voiceflow/ui';
import React from 'react';

import DraggableList, { DeleteComponent } from '@/components/DraggableList';
import * as Documentation from '@/config/documentation';
import * as CreatorV2 from '@/ducks/creatorV2';
import { useMapManager, useSelector, useToggle } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import type { NodeEditorV2 } from '@/pages/Canvas/managers/types';

import { NoMatchV2, NoReplyV2 } from '../../components';
import { cardFactory } from '../constants';
import { cloneCard } from '../utils';
import DraggableItem from './DraggableCard';
import { useCarouselLayoutOption } from './hooks';

const CarouselEditorRoot: NodeEditorV2<Realtime.NodeData.Carousel, Realtime.NodeData.CarouselBuiltInPorts> = () => {
  const editor = EditorV2.useEditor<Realtime.NodeData.Carousel, Realtime.NodeData.CarouselBuiltInPorts>();
  const parentNode = useSelector(CreatorV2.nodeByIDSelector, { id: editor.node.parentNode });

  const isLast = React.useMemo(() => {
    if (!parentNode) return false;
    return [...parentNode.combinedNodes].pop() === editor.nodeID;
  }, [parentNode]);

  const [isDragging, toggleDragging] = useToggle(false);

  const onRemove = usePersistFunction(async (_: unknown, index: number) => {
    const { buttons } = editor.data.cards[index];
    const portsToRemove = buttons.map((button) => ({ key: button.id, portID: editor.node.ports.out.byKey[button.id] }));

    return editor.engine.port.removeManyByKey(portsToRemove);
  });

  const mapManager = useMapManager(editor.data.cards, (cards) => editor.onChange({ cards }), {
    onAdd: (card) => Promise.all(card.buttons.map((button) => editor.engine.port.addByKey(editor.nodeID, button.id))),
    clone: cloneCard,
    factory: () => cardFactory(editor.platform),
    onRemove,
  });

  const noMatchConfig = NoMatchV2.useConfig({ step: editor.data });
  const noReplyConfig = NoReplyV2.useConfig({ step: editor.data });
  const carouselLayoutOption = useCarouselLayoutOption(editor.data.layout, (layout) => editor.onChange({ layout }));

  return (
    <EditorV2
      header={<EditorV2.DefaultHeader />}
      footer={
        !isDragging && (
          <EditorV2.DefaultFooter tutorial={Documentation.CAROUSEL_STEP}>
            <EditorV2.FooterActionsButton
              actions={[carouselLayoutOption, ...(isLast ? [noMatchConfig.option, noReplyConfig.option] : [])]}
            />
            <Button variant={Button.Variant.PRIMARY} onClick={() => mapManager.onAdd()} squareRadius>
              Add Card
            </Button>
          </EditorV2.DefaultFooter>
        )
      }
    >
      <DraggableList
        type="cards-editor"
        canDrag={!mapManager.isOnlyItem}
        onEndDrag={toggleDragging}
        itemProps={{ editor, latestCreatedKey: mapManager.latestCreatedKey }}
        mapManager={mapManager}
        onStartDrag={toggleDragging}
        itemComponent={DraggableItem}
        deleteComponent={DeleteComponent}
        partialDragItem
        previewComponent={DraggableItem}
        withContextMenuDelete={!mapManager.isOnlyItem}
        withContextMenuDuplicate
      />

      {isLast && !isDragging && (
        <>
          {noMatchConfig.section}
          {noReplyConfig.section}
        </>
      )}
    </EditorV2>
  );
};

export default CarouselEditorRoot;
