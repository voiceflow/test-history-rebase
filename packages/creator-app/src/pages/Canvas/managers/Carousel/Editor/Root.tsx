import * as Realtime from '@voiceflow/realtime-sdk';
import { Button, usePersistFunction } from '@voiceflow/ui';
import React from 'react';

import DraggableList, { DeleteComponent, MapManagedEditActionHandler } from '@/components/DraggableList';
import * as CreatorV2 from '@/ducks/creatorV2';
import { useManager, useSelector, useToggle } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { NodeEditorV2 } from '@/pages/Canvas/managers/types';

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

  const onChange = usePersistFunction((cards: Realtime.NodeData.Carousel['cards'], save?: boolean) => editor.onChange({ cards }, save));

  const onRemove = usePersistFunction(async (_: unknown, index: number) => {
    const { buttons } = editor.data.cards[index];
    const portsToRemove = buttons.map((button) => ({ key: button.id, portID: editor.node.ports.out.byKey[button.id] }));

    return editor.engine.port.removeManyByKey(portsToRemove);
  });

  const onClone = usePersistFunction((initVal: Realtime.NodeData.Carousel.Card, targetVal: Realtime.NodeData.Carousel.Card) => {
    const clonedCard = cloneCard(initVal, targetVal);
    clonedCard.buttons.map((button) => editor.engine.port.addByKey(editor.nodeID, button.id));

    return clonedCard;
  });

  const managerAPI = useManager(editor.data.cards, onChange, {
    factory: cardFactory,
    clone: onClone,
    autosave: false,
    onRemove,
  });

  const onDuplicate = usePersistFunction<MapManagedEditActionHandler<Realtime.NodeData.Carousel.Card>>((_, item) =>
    managerAPI.onDuplicate(item.index, item.item)
  );

  const noMatchConfig = NoMatchV2.useConfig();
  const noReplyConfig = NoReplyV2.useConfig();
  const carouselLayoutOption = useCarouselLayoutOption(editor.data.layout, (layout) => editor.onChange({ layout }, true));

  const actions = [carouselLayoutOption, ...(isLast ? [noMatchConfig.option, noReplyConfig.option] : [])];
  const hasManyCards = editor.data.cards.length > 1;

  return (
    <EditorV2
      header={<EditorV2.DefaultHeader />}
      footer={
        !isDragging && (
          <EditorV2.DefaultFooter>
            <EditorV2.FooterActionsButton actions={actions} />
            <Button variant={Button.Variant.PRIMARY} onClick={() => managerAPI.onAdd()} squareRadius>
              Add Card
            </Button>
          </EditorV2.DefaultFooter>
        )
      }
    >
      <DraggableList
        type="cards-editor"
        onDelete={managerAPI.onRemove}
        onReorder={managerAPI.onReorder}
        onDuplicate={onDuplicate}
        onEndDrag={toggleDragging}
        canDrag={() => hasManyCards}
        itemProps={{ editor, latestCreatedKey: managerAPI.latestCreatedKey }}
        mapManaged={managerAPI.mapManaged}
        onStartDrag={toggleDragging}
        itemComponent={DraggableItem}
        deleteComponent={DeleteComponent}
        partialDragItem
        previewComponent={DraggableItem}
        withContextMenuDelete={hasManyCards}
        contextMenuSelfDismiss
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
