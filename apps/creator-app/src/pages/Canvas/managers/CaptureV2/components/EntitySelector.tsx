import { Utils } from '@voiceflow/common';
import { Box, defaultMenuLabelRenderer, isNotUIOnlyMenuItemOption, Menu, Select, System, UIOnlyMenuItemOption } from '@voiceflow/ui';
import React from 'react';

import { EntityOption } from './hooks';

interface EntitySelectorProps {
  value?: string | null;
  onEdit?: VoidFunction;
  options: Array<EntityOption | UIOnlyMenuItemOption>;
  onCreate: (value: string) => void;
  onSelect: (slotID: string | null) => void;
  inDropdownSearch?: boolean;
}

const EntitySelector: React.FC<EntitySelectorProps> = ({ value, options, onEdit, onSelect, onCreate, inDropdownSearch = true }) => {
  const optionsMap = React.useMemo(() => Utils.array.createMap(options.filter(isNotUIOnlyMenuItemOption), Utils.object.selectID), [options]);

  return (
    <Select
      value={value}
      options={options}
      onCreate={onCreate}
      onSelect={onSelect}
      fullWidth
      clearable
      searchable
      leftAction={onEdit ? { icon: 'edit', onClick: onEdit } : undefined}
      placeholder="Select entity to capture"
      getOptionLabel={(value) => value && optionsMap[value]?.label}
      getOptionValue={(option) => option?.id}
      inDropdownSearch={inDropdownSearch}
      alwaysShowCreate
      renderOptionLabel={(option, searchLabel, _, getOptionValue, config) =>
        defaultMenuLabelRenderer<EntityOption, string>(option, searchLabel, (value) => value && optionsMap[value]?.name, getOptionValue, config)
      }
      renderEmpty={({ search }) => (
        <Box py={12} color="#62778c" flex={1} textAlign="center">
          {!search ? 'No entities exist in your assistant. ' : 'No entities found. '}
        </Box>
      )}
      renderSearchSuffix={({ close, searchLabel }) => (
        <System.IconButtonsGroup.Base>
          <System.IconButton.Base icon="plus" onClick={Utils.functional.chainVoid(close, () => onCreate(searchLabel))} />
        </System.IconButtonsGroup.Base>
      )}
      clearOnSelectActive
      renderFooterAction={({ close, searchLabel }) => (
        <Menu.Footer>
          <Menu.Footer.Action onClick={Utils.functional.chainVoid(close, () => onCreate(searchLabel))}>Create New Entity</Menu.Footer.Action>
        </Menu.Footer>
      )}
      createInputPlaceholder="entities"
    />
  );
};

export default EntitySelector;
