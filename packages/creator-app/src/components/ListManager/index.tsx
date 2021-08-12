import _isNumber from 'lodash/isNumber';
import React from 'react';

import { useManager } from '@/hooks';

import { ItemWrapper, RemoveIcon } from './components';

interface RenderForm<I> {
  value?: I | null;
  onAdd: (value: I) => void;
  onChange: (value: I) => void;
  addError?: string;
}

interface ItemOptions<I> {
  key: string;
  index: number;
  onUpdate: (value: I) => void;
}

type ListManagerProps<I> = React.PropsWithChildren<{
  items: I[];
  divider?: boolean;
  onUpdate: (items: I[]) => void;
  beforeAdd?: (value: I) => void;
  renderForm: React.FC<RenderForm<I>>;
  renderItem?: (item: I, options: ItemOptions<I>) => React.ReactElement;
  renderList?: React.FC<any>;
  addToStart?: boolean;
  addValidation?: (value: I) => { valid: boolean; error?: string };
  requiredItemIndex?: number;
  initialValue?: I;
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
  requiredItemIndex,
  initialValue,
}: ListManagerProps<I>): React.ReactElement {
  const [addError, setAddError] = React.useState<string>();
  const [formValue, onChangeFormValue] = React.useState<I | null>(initialValue as I);
  const { items: managedItems, onAdd, onAddToStart, onRemove, onReorder, toggleOpen, mapManaged, latestCreatedKey } = useManager(items, onUpdate);

  const onAddItem = (value: I) => {
    const { valid, error } = addValidation ? addValidation(value) : { valid: true, error: null };

    if (valid) {
      onChangeFormValue(null);
      beforeAdd?.(value);
      addToStart ? onAddToStart(value) : onAdd(value);
    } else if (error) {
      onChangeFormValue(value);
      setAddError(error);
    }
  };

  const itemRenderer = (item: I, options: ItemOptions<I>) => (
    <ItemWrapper key={options.key}>
      {renderItem!(item, options)}
      <RemoveIcon isHidden={_isNumber(requiredItemIndex) && options.index === requiredItemIndex} onClick={() => onRemove(options.key)} />
    </ItemWrapper>
  );

  return (
    <>
      {renderForm({
        value: formValue,
        onAdd: onAddItem,
        addError,
        onChange: onChangeFormValue,
      })}

      {divider && !!managedItems.length && <hr />}

      {renderList
        ? renderList({ items: managedItems, onAdd: onAddItem, onRemove, onReorder, toggleOpen, mapManaged, itemRenderer, latestCreatedKey })
        : mapManaged(itemRenderer)}
    </>
  );
}

export default ListManager;
