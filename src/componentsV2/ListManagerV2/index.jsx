import React from 'react';

import { useManager } from '@/hooks';

import { ItemWrapper, RemoveIcon } from './components/styled';

function ListManager({ items = [], renderForm, renderItem, renderList, onUpdate, divider = true, addToStart, addValidation, beforeAdd }) {
  const [addError, setAddError] = React.useState();
  const [formValue, onChangeFormValue] = React.useState();
  const { items: managedItems, onAdd, onAddToStart, onRemove, onReorder, toggleOpen, mapManaged, latestCreatedKey } = useManager(items, onUpdate);

  const onAddItem = (value) => {
    const { valid, error } = addValidation ? addValidation(value) : { valid: true };

    if (valid) {
      onChangeFormValue(null);
      beforeAdd?.(value);
      addToStart ? onAddToStart(value) : onAdd(value);
    } else if (error) {
      onChangeFormValue(value);
      setAddError(error);
    }
  };

  const itemRenderer = (item, options) => (
    <ItemWrapper key={options.key}>
      {renderItem(item, options)}
      <RemoveIcon onClick={() => onRemove(options.key)} />
    </ItemWrapper>
  );

  return (
    <>
      {renderForm({
        value: formValue,
        items: managedItems,
        onAdd: onAddItem,
        addError,
        onChange: onChangeFormValue,
        onRemove,
        onReorder,
        toggleOpen,
        mapManaged,
        setAddError,
        itemRenderer,
        latestCreatedKey,
      })}

      {divider && !!managedItems.length && <hr />}

      {renderList
        ? renderList({ items: managedItems, onAdd: onAddItem, onRemove, onReorder, toggleOpen, mapManaged, itemRenderer, latestCreatedKey })
        : mapManaged(itemRenderer)}
    </>
  );
}

export default ListManager;
