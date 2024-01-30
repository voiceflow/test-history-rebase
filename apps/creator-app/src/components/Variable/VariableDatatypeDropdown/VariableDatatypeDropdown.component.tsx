import { Utils } from '@voiceflow/common';
import { VariableDatatype } from '@voiceflow/dtos';
import { Box, Dropdown, Menu, Search } from '@voiceflow/ui-next';
import React, { useMemo } from 'react';

import { useDeferredSearch } from '@/hooks/search.hook';

import type { IVariableDatatypeDropdown } from './VariableDatatypeDropdown.interface';

export const VariableDatatypeDropdown: React.FC<IVariableDatatypeDropdown> = ({ error, value, onClick, minWidth, disabled, onValueChange }) => {
  const datatypes = useMemo(() => Object.values(VariableDatatype), []);

  const search = useDeferredSearch({
    items: datatypes,
    searchBy: (item) => item,
  });

  return (
    <Box minWidth={minWidth} direction="column">
      <Dropdown
        value={value ? Utils.string.capitalizeFirstLetter(value) : null}
        label="Data type"
        error={!!error}
        onClick={onClick}
        disabled={disabled}
        placeholder="Select type"
        errorMessage={error ?? undefined}
      >
        {({ onClose, referenceRef }) => (
          <Menu
            width={referenceRef.current?.clientWidth}
            searchSection={<Search value={search.value} onValueChange={search.setValue} placeholder="Search" />}
            numberOfItemsToShow={6}
          >
            {search.hasItems ? (
              search.items.map((value) => (
                <Menu.Item
                  key={value}
                  label={Utils.string.capitalizeFirstLetter(value)}
                  onClick={Utils.functional.chain(onClose, () => onValueChange(value))}
                  searchValue={search.deferredValue}
                />
              ))
            ) : (
              <Menu.NotFound label="types" />
            )}
          </Menu>
        )}
      </Dropdown>
    </Box>
  );
};
