import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import { Variant, createTestableStory } from '@/../.storybook';
import DragLayer from '@/componentsV2/DragLayer';
import { DragProvider } from '@/contexts';
import { reorder, without } from '@/utils/array';

import DraggableList from '.';

const ItemComponent = ({ text, index, style }) => (
  <div
    style={{
      display: 'flex',
      width: '100%',
      height: '40px',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#7eaefe',
      borderTop: '1px solid #f3f3f3',
      color: '#fff',
      ...style,
    }}
  >
    {index}: {text}
  </div>
);

const PreviewComponent = (props) => (
  <ItemComponent
    {...props}
    style={{ display: 'flex', color: '#fff', backgroundColor: '#7e8efe', height: '100%', alignItems: 'center', justifyContent: 'center' }}
  />
);

// eslint-disable-next-line react/display-name
const DeleteComponent = React.forwardRef((props, ref) => (
  <div
    {...props}
    ref={ref}
    style={{
      position: 'relative',
      bottom: '0',
      marginLeft: '50px',
      display: 'flex',
      color: '#fff',
      backgroundColor: '#7e8e2e',
      height: '40px',
      width: '200px',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    Drop here to delete
  </div>
));

storiesOf('DraggableList', module)
  .add(
    'variants',
    createTestableStory(() => {
      const [items, updateItems] = React.useState(Array.from({ length: 5 }, (_, i) => ({ id: i, text: `item ${i + 1}` })));
      const onReorder = React.useCallback(
        (dragIndex, hoverIndex) => {
          updateItems(reorder(items, dragIndex, hoverIndex));
        },
        [items]
      );
      const onDelete = React.useCallback(
        (index) => {
          updateItems(without(items, index));
        },
        [items]
      );

      return (
        <DndProvider backend={HTML5Backend}>
          <DragProvider>
            <Variant label="default">
              <div style={{ width: '300px', height: '300px' }}>
                <DraggableList
                  type="default"
                  items={items}
                  onDrop={action('onDrop')}
                  onDelete={onDelete}
                  onEndDrag={action('onEndDrag')}
                  onReorder={onReorder}
                  onStartDrag={action('onStartDrag')}
                  itemComponent={ItemComponent}
                  deleteComponent={DeleteComponent}
                  previewComponent={PreviewComponent}
                />
              </div>
            </Variant>

            <DragLayer />
          </DragProvider>
        </DndProvider>
      );
    })
  )
  .add(
    'performance - (DontTest)',
    createTestableStory(() => {
      const [items, updateItems] = React.useState(Array.from({ length: 1000 }, (_, i) => ({ id: i, text: `item ${i + 1}` })));
      const onReorder = React.useCallback(
        (dragIndex, hoverIndex) => {
          updateItems(reorder(items, dragIndex, hoverIndex));
        },
        [items]
      );

      const onDelete = React.useCallback(
        (index) => {
          updateItems(without(items, index));
        },
        [items]
      );

      return (
        <DndProvider backend={HTML5Backend}>
          <DragProvider>
            <Variant label="performance">
              <div style={{ width: '300px', height: '300px' }}>
                <DraggableList
                  type="default"
                  items={items}
                  onDrop={action('onDrop')}
                  onEndDrag={action('onEndDrag')}
                  onDelete={onDelete}
                  onReorder={onReorder}
                  onStartDrag={action('onStartDrag')}
                  itemComponent={ItemComponent}
                  deleteComponent={DeleteComponent}
                  previewComponent={PreviewComponent}
                />
              </div>
            </Variant>

            <DragLayer />
          </DragProvider>
        </DndProvider>
      );
    })
  );
