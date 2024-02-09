import { CUSTOM_SLOT_TYPE, Utils } from '@voiceflow/common';
import { tid } from '@voiceflow/style';
import { Box, Divider, Dropdown, Menu, Search } from '@voiceflow/ui-next';
import React from 'react';

import { Version } from '@/ducks';
import { useDeferredSearch } from '@/hooks/search.hook';
import { useSelector } from '@/hooks/store.hook';

import type { IEntityClassifierDropdown } from './EntityClassifierDropdown.interface';

const TEST_ID = tid('entity', 'classifier');

export const EntityClassifierDropdown: React.FC<IEntityClassifierDropdown> = ({ error, value, onClick, minWidth, disabled, onValueChange }) => {
  const entityClassifiers = useSelector(Version.active.entityTypesSelector);
  const entityClassifiersMap = useSelector(Version.active.entityTypesMapSelector);

  const search = useDeferredSearch({
    items: entityClassifiers,
    searchBy: (item) => item.label,
  });

  return (
    <Box minWidth={minWidth} direction="column">
      <Dropdown
        value={value ? entityClassifiersMap[value]?.label : null}
        label="Data type"
        error={!!error}
        onClick={onClick}
        disabled={disabled}
        placeholder="Select type"
        errorMessage={error ?? undefined}
        testID={TEST_ID}
      >
        {({ onClose, referenceRef }) => (
          <Menu
            width={referenceRef.current?.clientWidth}
            searchSection={<Search value={search.value} onValueChange={search.setValue} placeholder="Search" testID={tid(TEST_ID, 'search')} />}
            numberOfItemsToShow={6}
          >
            {search.hasItems ? (
              search.items.map(({ label, value }, index) =>
                index === 0 && value === CUSTOM_SLOT_TYPE && !search.deferredValue ? (
                  <React.Fragment key={value}>
                    <Menu.Item
                      label={label}
                      onClick={Utils.functional.chain(onClose, () => onValueChange(value))}
                      searchValue={search.deferredValue}
                      testID={tid(TEST_ID, 'menu-item', 'custom')}
                    />
                    <Divider fullWidth />
                  </React.Fragment>
                ) : (
                  <Menu.Item
                    key={value}
                    label={label}
                    onClick={Utils.functional.chain(onClose, () => onValueChange(value))}
                    searchValue={search.deferredValue}
                    testID={tid(TEST_ID, 'menu-item')}
                  />
                )
              )
            ) : (
              <Menu.NotFound label="types" testID={tid(TEST_ID, 'not-found')} />
            )}
          </Menu>
        )}
      </Dropdown>
    </Box>
  );
};
