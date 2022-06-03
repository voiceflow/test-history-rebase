import * as Realtime from '@voiceflow/realtime-sdk';
import { Button } from '@voiceflow/ui';
import React from 'react';

import DraggableList, { DeleteComponent } from '@/components/DraggableList';
import * as CreatorV2 from '@/ducks/creatorV2';
import { useManager, useSelector, useToggle } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { NodeEditorV2 } from '@/pages/Canvas/managers/types';

import { NoMatchV2, NoReplyV2 } from '../../components';
import { factory } from '../constants';
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

  const onChange = React.useCallback(
    (cards: Realtime.NodeData.Carousel['cards'], save?: boolean) => editor.onChange({ cards }, save),
    [editor.onChange]
  );

  const onRemove = React.useCallback(
    async (_: unknown, index: number) => {
      const { buttons } = editor.data.cards[index];
      const portsToRemove = buttons.map((button) => ({ key: button.id, portID: editor.node.ports.out.byKey[button.id] }));

      return editor.engine.port.removeManyByKey(portsToRemove);
    },
    [editor.engine.port.removeManyByKey, editor.node.ports.out.byKey, editor.data.cards]
  );

  const managerAPI = useManager(editor.data.cards, onChange, {
    factory,
    autosave: false,
    onRemove,
  });

  const noMatchConfig = NoMatchV2.useConfig();
  const noReplyConfig = NoReplyV2.useConfig();
  const carouselLayoutOption = useCarouselLayoutOption(editor.data.layout, (layout) => editor.onChange({ layout }, true));

  const actions = [carouselLayoutOption, ...(isLast ? [noMatchConfig.option, noReplyConfig.option] : [])];

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
        onEndDrag={toggleDragging}
        itemProps={{ editor, latestCreatedKey: managerAPI.latestCreatedKey }}
        mapManaged={managerAPI.mapManaged}
        onStartDrag={toggleDragging}
        itemComponent={DraggableItem}
        deleteComponent={DeleteComponent}
        partialDragItem
        previewComponent={DraggableItem}
        withContextMenuDelete
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
