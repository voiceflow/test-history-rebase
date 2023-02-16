import { Box, SectionV2 } from '@voiceflow/ui';
import React from 'react';

import { MapManaged, MapManagedSimpleAPI, useMapManager } from '@/hooks/mapManager';

interface RenderForm<I> {
  value?: I | null;
  onAdd: (value: I) => void;
  onChange: (value: I) => void;
  addError?: string;
  mapManager: MapManagedSimpleAPI<I>;
}

interface ItemOptions<I> {
  key: string;
  index: number;
  isLast: boolean;
  onUpdate: (value: I) => void;
}

type ListManagerProps<I> = React.PropsWithChildren<{
  items: I[];
  divider?: boolean;
  onUpdate: (items: I[]) => void;
  beforeAdd?: (value: I) => void;
  renderForm: React.FC<RenderForm<I>>;
  renderItem: (item: I, options: ItemOptions<I>) => React.ReactElement;
  addToStart?: boolean;
  renderList?: (options: {
    items: I[];
    onAdd: (value: I) => void;
    onRemove: (key: string) => Promise<void>;
    onReorder: (from: number, to: number) => Promise<void>;
    mapManaged: MapManaged<I>;
    mapManager: MapManagedSimpleAPI<I>;
    itemRenderer: (item: I, options: ItemOptions<I>) => JSX.Element | null;
    latestCreatedKey: string | undefined;
  }) => React.ReactElement;
  initialValue?: I;
  addValidation?: (value: I) => { valid: boolean; error?: string };
  maxVisibleItems?: number;
  requiredItemIndex?: number;
}>;

function ListManager<I>({
  items = [],
  divider = true,
  onUpdate,
  beforeAdd,
  renderForm,
  renderItem,
  renderList,
  addToStart,
  addValidation,
  initialValue,
  maxVisibleItems,
  requiredItemIndex,
}: ListManagerProps<I>): React.ReactElement {
  const [addError, setAddError] = React.useState<string>();
  const [formValue, onChangeFormValue] = React.useState<I | null>(initialValue as I);

  const mapManager = useMapManager(items, onUpdate, { maxVisibleItems });

  const onAddItem = (value: I) => {
    const { valid, error } = addValidation ? addValidation(value) : { valid: true, error: null };

    if (valid) {
      setAddError(undefined);
      onChangeFormValue(null);
      beforeAdd?.(value);

      if (addToStart) {
        mapManager.onAddToStart(value);
      } else {
        mapManager.onAdd(value);
      }
    } else if (error) {
      onChangeFormValue(value);
      setAddError(error);
    }
  };

  const itemRenderer = (item: I, options: ItemOptions<I>) => (
    <Box key={options.key} mb={options.isLast ? 0 : 12} width="100%">
      <SectionV2.ListItem
        action={<SectionV2.RemoveButton onClick={() => mapManager.onRemove(options.key)} disabled={options.index === requiredItemIndex} />}
      >
        {renderItem(item, options)}
      </SectionV2.ListItem>
    </Box>
  );

  return (
    <>
      {renderForm({
        value: formValue,
        onAdd: onAddItem,
        addError,
        onChange: onChangeFormValue,
        mapManager,
      })}

      {divider && !!mapManager.items.length && <hr />}

      {renderList
        ? renderList({
            items: mapManager.items,
            onAdd: onAddItem,
            onRemove: mapManager.onRemove,
            onReorder: mapManager.onReorder,
            mapManaged: mapManager.map,
            mapManager,
            itemRenderer,
            latestCreatedKey: mapManager.latestCreatedKey,
          })
        : mapManager.map(itemRenderer)}
    </>
  );
}

export default ListManager;
