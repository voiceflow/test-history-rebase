import { ContextMenu, Input, InputVariant, OverflowText, useDidUpdateEffect, withEnterPress, withInputBlur, withTargetValue } from '@voiceflow/ui';
import React from 'react';

import { InteractionModelTabType } from '@/constants';
import { useNLUItemMenu } from '@/contexts/NLUContext/hooks';
import { useLinkedState } from '@/hooks';

import { Container } from './components';

interface ListItemProps {
  name: string;
  active?: boolean;
  onClick: () => void;
  onRename?: (name: string, id: string) => void;
  onDelete?: () => void;
  id: string;
  nameValidation: (name: string) => string;
  isCreating?: boolean;
  onBlur?: (name: string) => void;
  isActiveItemRename?: boolean;
  setIsActiveItemRename?: (val: boolean) => void;
  ref?: React.Ref<HTMLInputElement>;
  type: InteractionModelTabType;
  isBuiltIn?: boolean;
}

const ListItem: React.ForwardRefRenderFunction<HTMLInputElement, ListItemProps> = (
  {
    id,
    isBuiltIn,
    isActiveItemRename,
    type,
    setIsActiveItemRename,
    onBlur,
    nameValidation,
    isCreating = false,
    name,
    onRename,
    onDelete,
    active,
    onClick,
  },
  ref
) => {
  const [isRenaming, setIsRenaming] = React.useState(isCreating);
  const [localName, setLocalName] = useLinkedState(name);
  const { options } = useNLUItemMenu({ itemID: id, itemType: type, isBuiltIn, onRename: () => setIsRenaming(true), onDelete });

  const endRename = () => {
    try {
      if (localName.trim()) {
        if (onBlur) {
          onBlur(localName);
        } else {
          onRename?.(localName, id);
        }
      } else {
        setLocalName(name);
      }

      setIsRenaming(false);
      setIsActiveItemRename?.(false);
    } catch (e) {
      setLocalName(name);
    }
  };

  useDidUpdateEffect(() => {
    setLocalName(name);
  }, [name]);

  useDidUpdateEffect(() => {
    if (active && isActiveItemRename) {
      setIsRenaming(true);
    }
  }, [isActiveItemRename, active]);

  return (
    <ContextMenu selfDismiss options={options}>
      {({ onContextMenu, isOpen }) => (
        <Container onContextMenu={onContextMenu} onClick={onClick} active={active || !!(isOpen && options.length)}>
          {isRenaming ? (
            <Input
              ref={ref}
              value={localName}
              onBlur={endRename}
              fullWidth
              variant={InputVariant.INLINE}
              onFocus={({ target }) => target.select()}
              onChange={withTargetValue((val) => setLocalName(nameValidation(val)))}
              autoFocus
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
