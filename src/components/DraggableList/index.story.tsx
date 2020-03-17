import { action } from '@storybook/addon-actions';
import React from 'react';

import { reorder, without } from '@/utils/array';

import DraggableList, { DeleteComponent } from '.';

// eslint-disable-next-line react/display-name
const ItemComponent = React.forwardRef<HTMLDivElement, any>(({ item: { text }, index, style }, ref) => (
  <div
    ref={ref}
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
));

const PreviewComponent = (props: any) => (
  <ItemComponent
    {...props}
    style={{ display: 'flex', color: '#fff', backgroundColor: '#7e8efe', height: '100%', alignItems: 'center', justifyContent: 'center' }}
  />
);

// eslint-disable-next-line react/display-name
const CustomDeleteComponent = React.forwardRef<HTMLDivElement, any>((props, ref) => (
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

const getProps = (itemCount = 5) => {
  const [items, updateItems] = React.useState(Array.from({ length: itemCount }, (_, i) => ({ id: i, text: `item ${i + 1}` })));

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

  return {
    items,
    onReorder,
    onDelete,
    itemComponent: ItemComponent,
    deleteComponent: DeleteComponent,
    previewComponent: PreviewComponent,
    onDrop: action('onDrop'),
    onEndDrag: action('onEndDrag'),
    onStartDrag: action('onStartDrag'),
    getItemKey: (item: any) => item.id,
  };
};

export default {
  title: 'Draggable List',
  component: DraggableList,
  includeStories: [],
};

export const normal = () => <DraggableList type="default" {...getProps()} />;

export const withCustomDelete = () => <DraggableList type="custom-delete" {...getProps()} deleteComponent={CustomDeleteComponent} />;

export const performance = () => <DraggableList type="default" {...getProps(1000)} />;
