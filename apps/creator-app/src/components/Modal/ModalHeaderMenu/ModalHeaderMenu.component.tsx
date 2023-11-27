import { Utils } from '@voiceflow/common';
import { Box, Menu, MenuItem, Popper, Search, SquareButton } from '@voiceflow/ui-next';
import React, { useMemo } from 'react';

import { useDeferredSearch } from '@/hooks/search.hook';

import { IModalHeaderMenu } from './ModalHeaderMenu.interface';

export const ModalHeaderMenu: React.FC<IModalHeaderMenu> = ({ items, activeID, onSelect }) => {
  const search = useDeferredSearch({
    items: useMemo(() => items.filter((item) => item.id !== activeID), [items]),
    searchBy: (item) => item.name,
  });

  return (
    <Popper
      placement="left-start"
      referenceElement={({ ref, isOpen, onToggle }) => (
        <Box mr={8}>
          <SquareButton ref={ref} size="medium" onClick={onToggle} iconName="Menu" isActive={isOpen} />
        </Box>
      )}
    >
      {({ onClose }) => (
        <Menu searchSection={<Search value={search.value} placeholder="Search" onValueChange={search.setValue} />}>
          {search.items.map((item) => (
            <MenuItem
              key={item.id}
              label={item.name}
              onClick={Utils.functional.chain(onClose, () => onSelect(item.id))}
              searchValue={search.deferredValue}
            />
          ))}
        </Menu>
      )}
    </Popper>
  );
};
