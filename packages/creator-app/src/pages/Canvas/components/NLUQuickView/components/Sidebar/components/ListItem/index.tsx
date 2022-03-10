import { Input, InputVariant, OverflowText, useDidUpdateEffect, withEnterPress, withInputBlur, withTargetValue } from '@voiceflow/ui';
import React from 'react';

import ContextMenu from '@/components/ContextMenu';

import { Container } from './components';

interface ListItemProps {
  name: string;
  active?: boolean;
  onClick: () => void;
  onDelete: (id: string) => void;
  onRename?: (name: string, id: string) => void;
  id: string;
  nameValidation: (name: string) => string;
  isCreating?: boolean;
  onBlur?: (name: string) => void;
  ref?: React.Ref<HTMLInputElement>;
}

const ListItem: React.ForwardRefRenderFunction<HTMLInputElement, ListItemProps> = (
  { id, onBlur, nameValidation, isCreating = false, name, onRename, onDelete, active, onClick },
  ref
) => {
  const [isRenaming, setIsRenaming] = React.useState(isCreating);
  const [localName, setLocalName] = React.useState(name);

  useDidUpdateEffect(() => {
    setLocalName(name);
  }, [name]);

  const renameOptions = !onRename
    ? []
    : [
        { label: 'Rename', value: 'rename', onClick: () => setIsRenaming(true) },
        { label: 'Divider', divider: true },
      ];

  const contextOptions = [...renameOptions, { label: 'Delete', value: 'delete', onClick: () => onDelete(id) }];

  return (
    <ContextMenu selfDismiss options={contextOptions}>
      {({ onContextMenu, isOpen }) => (
        <Container onContextMenu={onContextMenu} onClick={onClick} active={active || isOpen}>
          {isRenaming ? (
            <Input
              ref={ref}
              value={localName}
              onBlur={() => {
                if (onBlur) {
                  onBlur(localName);
                } else {
                  onRename?.(localName, id);
                  setIsRenaming(false);
                }
              }}
              variant={InputVariant.INLINE}
              onFocus={({ target }) => target.select()}
              onChange={withTargetValue((val) => setLocalName(nameValidation(val)))}
              autoFocus // eslint-disable-line jsx-a11y/no-autofocus
              onKeyPress={withEnterPress(withInputBlur())}
            />
          ) : (
            <OverflowText>{localName}</OverflowText>
          )}
        </Container>
      )}
    </ContextMenu>
  );
};

export default React.forwardRef(ListItem);
