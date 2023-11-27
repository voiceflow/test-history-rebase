import { CUSTOM_SLOT_TYPE, Utils } from '@voiceflow/common';
import { Box, Divider, Dropdown, Menu, MenuItem, Search } from '@voiceflow/ui-next';
import React from 'react';

import { Version } from '@/ducks';
import { useDeferredSearch } from '@/hooks/search.hook';
import { useSelector } from '@/hooks/store.hook';

import type { IEntityClassifierDropdown } from './EntityClassifierDropdown.interface';

export const EntityClassifierDropdown: React.FC<IEntityClassifierDropdown> = ({ error, value, onClick, minWidth, disabled, onValueChange }) => {
  const entityClassifiers = useSelector(Version.active.entityTypesSelector);
  const entityClassifiersMap = useSelector(Version.active.entityTypesMapSelector);

  const search = useDeferredSearch({
    items: entityClassifiers,
    searchBy: (item) => item.label,
  });

  return (
    <Box minWidth={minWidth ? `${minWidth}px` : undefined} direction="column">
      <Dropdown
        value={value ? entityClassifiersMap[value]?.label : null}
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
            {search.items.map(({ label, value }, index) =>
              index === 0 && value === CUSTOM_SLOT_TYPE && !search.deferredValue ? (
                <React.Fragment key={value}>
                  <MenuItem label={label} onClick={Utils.functional.chain(onClose, () => onValueChange(value))} searchValue={search.deferredValue} />
                  <Divider fullWidth />
                </React.Fragment>
              ) : (
                <MenuItem
                  key={value}
                  label={label}
                  onClick={Utils.functional.chain(onClose, () => onValueChange(value))}
                  searchValue={search.deferredValue}
                />
              )
            )}
          </Menu>
        )}
      </Dropdown>
    </Box>
  );
};
