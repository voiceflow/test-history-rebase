import { Nullable } from '@voiceflow/common';
import { Link } from '@voiceflow/ui';
import React from 'react';

import DraggableList, {
  DeleteComponent,
  DragPreviewComponentProps,
  ItemComponentProps,
  MappedItemComponentHandlers,
} from '@/components/DraggableList';
import { MapManagedFactoryAPI, MapManagedSimpleAPI, useMapManager, useToggle } from '@/hooks';
import { Content, ContentRenderOptions, ControlOptions, Controls, EditorControlsProps } from '@/pages/Canvas/components/Editor';

export type ListItemExtraProps<ExtraItemProps = {}> = DragPreviewComponentProps &
  ExtraItemProps & {
    isOnlyItem: boolean;
    isRandomized?: boolean;
    latestCreatedKey: string | undefined;
  };

export type ListItemComponentProps<Item, ExtraItemProps = {}> = ItemComponentProps<Item> &
  MappedItemComponentHandlers<Item> &
  ListItemExtraProps<ExtraItemProps>;

export type ListItemComponent<Item, ExtraItemProps = {}> = React.NamedExoticComponent<
  React.PropsWithoutRef<ListItemComponentProps<Item, ExtraItemProps>> & React.RefAttributes<HTMLElement>
>;

interface ListEditorContentBaseProps<Item, ExtraItemProps = {}> {
  type: string;
  items: Item[];
  footer?: React.ReactNode;
  tutorial?: EditorControlsProps['tutorial'];
  maxItems?: number;
  onRemove?: (value: Item, index: number) => void;
  onReorder?: (dragIndex: number, hoverIndex: number) => void;
  itemComponent: ListItemComponent<Item, ExtraItemProps>;
  onChangeItems: (items: Item[]) => void;
  howItWorksLink?: string;
  extraItemProps?: ExtraItemProps;
}

export interface ListEditorContentSimpleProps<Item, ExtraItemProps = {}> extends ListEditorContentBaseProps<Item, ExtraItemProps> {
  factory?: never;
  renderMenu?: Nullable<(mapManager: MapManagedSimpleAPI<Item>, options: ContentRenderOptions) => React.ReactNode>;
  getControlOptions: (mapManager: MapManagedSimpleAPI<Item>, options: ContentRenderOptions) => ControlOptions[];
}

export interface ListEditorContentFactoryProps<Item, ExtraItemProps = {}> extends ListEditorContentBaseProps<Item, ExtraItemProps> {
  factory: () => Item;
  renderMenu?: Nullable<(mapManager: MapManagedFactoryAPI<Item>, options: ContentRenderOptions) => React.ReactNode>;
  getControlOptions: (mapManager: MapManagedFactoryAPI<Item>, options: ContentRenderOptions) => ControlOptions[];
}

interface ListEditorContentComponent {
  <Item, ExtraItemProps = {}>(props: ListEditorContentSimpleProps<Item, ExtraItemProps>): JSX.Element;
  <Item, ExtraItemProps = {}>(props: ListEditorContentFactoryProps<Item, ExtraItemProps>): JSX.Element;
}

const ListEditorContent: ListEditorContentComponent = ({
  type,
  items: listItems,
  footer,
  factory,
  onRemove,
  maxItems,
  tutorial,
  onReorder,
  renderMenu,
  onChangeItems,
  itemComponent,
  extraItemProps,
  howItWorksLink,
  getControlOptions,
}) => {
  const [isDragging, toggleDragging] = useToggle(false);

  const mapManager = useMapManager(listItems, onChangeItems, { factory: factory!, maxItems, onRemove, onReorder });

  return (
    <Content
      footer={(options) => (
        <Controls menu={renderMenu?.(mapManager, options)} options={getControlOptions(mapManager, options)} tutorial={tutorial}>
          {!!howItWorksLink && <Link href={howItWorksLink}>How it Works</Link>}
        </Controls>
      )}
      hideFooter={isDragging}
    >
      <DraggableList
        type={type}
        footer={footer}
        onEndDrag={toggleDragging}
        itemProps={
          {
            isOnlyItem: mapManager.isOnlyItem,
            latestCreatedKey: mapManager.latestCreatedKey,
            ...extraItemProps,
          } as ListItemExtraProps<typeof extraItemProps>
        }
        mapManager={mapManager}
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

export default ListEditorContent;
