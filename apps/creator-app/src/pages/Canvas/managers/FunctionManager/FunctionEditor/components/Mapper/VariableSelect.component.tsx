import { Utils } from '@voiceflow/common';
import { ActionButtons, Box, Menu, MenuItem, Popper, Search, Text, Tokens, Variable } from '@voiceflow/ui-next';
import React from 'react';

import { Designer } from '@/ducks';
import { useSelector } from '@/hooks';
import { useDeferredSearch } from '@/hooks/search.hook';

import { variableSelect } from '../../Function.css';

interface IVariableSelect {
  value: string;
  description?: string;
  placeholder?: string;
  onSelect: (value: string) => void;
}

export const VariableSelect: React.FC<IVariableSelect> = ({ value, onSelect }) => {
  const variablesMap = useSelector(Designer.selectors.slateVariablesMapByID);
  const search = useDeferredSearch({
    items: Object.values(variablesMap),
    searchBy: (item) => item.name,
  });

  return (
    <Popper
      placement="bottom"
      referenceElement={({ onOpen, ref, isOpen }) => (
        <Box ref={ref}>
          {value ? (
            <Variable className={variableSelect} label={value} onClick={onOpen} isActive={isOpen} size="large" />
          ) : (
            <Text color={Tokens.colors.neutralDark.neutralsDark50} className={variableSelect} onClick={onOpen}>{`Apply to {var}`}</Text>
          )}
        </Box>
      )}
      modifiers={[{ name: 'offset', options: { offset: [0, 8] } }]}
      onClose={() => search.setValue('')}
      zIndex={1000}
      disableLayers
    >
      {({ onClose }) => (
        <Menu
          searchSection={<Search value={search.value} onValueChange={search.setValue} placeholder="Search" />}
          actionButtons={
            value && (
              <ActionButtons firstButton={<ActionButtons.Button label="Remove" onClick={Utils.functional.chain(() => onSelect(''), onClose)} />} />
            )
          }
        >
          {search.items.map(({ name }) => (
            <MenuItem searchValue={search.value} key={name} label={name} onClick={Utils.functional.chain(() => onSelect(name), onClose)} />
          ))}
        </Menu>
      )}
    </Popper>
  );
};
