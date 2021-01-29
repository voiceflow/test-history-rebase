import React from 'react';

import { useManager } from '@/hooks';

import { ItemWrapper, RemoveIcon } from './components/styled';

type RenderForm<I> = {
  value?: I | null;
  onAdd: (value: I) => void;
  onChange: (value: I) => void;
  addError?: string;
};

type ListManagerProps<I> = React.PropsWithChildren<{
  items: I[];
  onUpdate: (items: I[]) => void;
  beforeAdd?: (value: I) => void;
  renderForm: React.FC<RenderForm<I>>;
  renderItem?: (item: I, options: { onUpdate: (value: I) => void }) => React.ReactElement;
  renderList?: React.FC<any>;
  addToStart?: boolean;
  addValidation?: (value: I) => { valid: boolean; error?: string };
  divider?: boolean;
}>;

function ListManager<I>({
  items = [],
  renderForm,
  renderItem,
  renderList,
  onUpdate,
  divider = true,
  addToStart,
  addValidation,
  beforeAdd,
}: ListManagerProps<I>): React.ReactElement {
  const [addError, setAddError] = React.useState<string>();
  const [formValue, onChangeFormValue] = React.useState<I | null>();
  const { items: managedItems, onAdd, onAddToStart, onRemove, onReorder, toggleOpen, mapManaged, latestCreatedKey } = useManager(items, onUpdate);

  const onAddItem = (value: I) => {
    const { valid, error } = addValidation ? addValidation(value) : { valid: true, error: undefined };

    if (valid) {
      onChangeFormValue(null);
      beforeAdd?.(value);
      addToStart ? onAddToStart(value) : onAdd(value);
    } else if (error) {
      onChangeFormValue(value);
      setAddError(error);
    }
  };

  const itemRenderer = (item: I, options: any) => (
    <ItemWrapper key={options.key}>
      {renderItem!(item, options)}
      <RemoveIcon onClick={() => onRemove(options.key)} />
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
