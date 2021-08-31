import { Link, usePersistFunction } from '@voiceflow/ui';
import React from 'react';

import DraggableList, {
  DeleteComponent,
  DragPreviewComponentProps,
  ItemComponentProps,
  MappedItemComponentHandlers,
} from '@/components/DraggableList';
import { MapManagedAPI, useManager, useToggle } from '@/hooks';
import { Content, ContentRenderOptions, ControlOptions, Controls, EditorControlsProps } from '@/pages/Canvas/components/Editor';
import { chain } from '@/utils/functional';

export type ListItemExtraProps<E = {}> = DragPreviewComponentProps &
  E & {
    isOnlyItem: boolean;
    latestCreatedKey: string | undefined;
  };

export type ListItemComponentProps<T, E = {}> = ItemComponentProps<T> & MappedItemComponentHandlers<T> & ListItemExtraProps<E>;

export type ListItemComponent<T, E = {}> = React.NamedExoticComponent<
  React.PropsWithoutRef<ListItemComponentProps<T, E>> & React.RefAttributes<HTMLElement>
>;

export interface ListEditorContentProps<T, F extends any[] = [], E = {}> {
  type: string;
  items: T[];
  footer?: React.ReactNode;
  factory: (...args: F) => T;
  tutorial?: EditorControlsProps['tutorial'];
  maxItems?: number;
  onRemove?: (value: T, index: number) => void;
  onReorder?: (dragIndex: number, hoverIndex: number) => void;
  renderMenu?: (options: MapManagedAPI<T, F> & ContentRenderOptions) => React.ReactNode;
  itemComponent: ListItemComponent<T, E>;
  onChangeItems: (items: T[]) => void;
  howItWorksLink?: string;
  extraItemProps?: E;
  getControlOptions: (options: MapManagedAPI<T, F> & ContentRenderOptions) => ControlOptions[];
}

const ListEditorContent = <T, F extends any[] = [], E = {}>({
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
}: React.PropsWithChildren<ListEditorContentProps<T, F, E>>): React.ReactElement<any, any> => {
  const [isDragging, toggleDragging] = useToggle(false);
  const persistedOnRemove = usePersistFunction(onRemove);

  const mapManagedApi = useManager(listItems, onChangeItems, { factory, maxItems, handleRemove: persistedOnRemove });

  return (
    <Content
      footer={(options) => (
        <Controls
          menu={renderMenu?.({ ...mapManagedApi, ...options })}
          options={getControlOptions({ ...mapManagedApi, ...options })}
          tutorial={tutorial}
        >
          {!!howItWorksLink && <Link href={howItWorksLink}>How it Works</Link>}
        </Controls>
      )}
      hideFooter={isDragging}
    >
      <DraggableList
        type={type}
        footer={footer}
        onDelete={mapManagedApi.onRemove}
        onReorder={chain(mapManagedApi.onReorder, onReorder)}
        onEndDrag={toggleDragging}
        itemProps={
          {
            isOnlyItem: mapManagedApi.items.length === 1,
            latestCreatedKey: mapManagedApi.latestCreatedKey,
            ...extraItemProps,
          } as ListItemExtraProps<E>
        }
        mapManaged={mapManagedApi.mapManaged}
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
