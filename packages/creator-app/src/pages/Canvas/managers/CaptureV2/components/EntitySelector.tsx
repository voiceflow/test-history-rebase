import { Utils } from '@voiceflow/common';
import { defaultMenuLabelRenderer, IconButton, isNotUIOnlyMenuItemOption, NestedMenuComponents, Select, UIOnlyMenuItemOption } from '@voiceflow/ui';
import React from 'react';

import { FeatureFlag } from '@/config/features';
import { useFeature } from '@/hooks';

import { EntityOption } from './hooks';

interface EntitySelectorProps {
  value?: string | null;
  onEdit?: VoidFunction;
  options: Array<EntityOption | UIOnlyMenuItemOption>;
  onCreate: (value: string) => void;
  onSelect: (slotID: string | null) => void;
}

const EntitySelector: React.FC<EntitySelectorProps> = ({ value, options, onEdit, onSelect, onCreate }) => {
  const immModalsV2 = useFeature(FeatureFlag.IMM_MODALS_V2);

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
      inDropdownSearch
      alwaysShowCreate
      renderOptionLabel={(option, searchLabel, _, getOptionValue, config) =>
        defaultMenuLabelRenderer<EntityOption, string>(option, searchLabel, (value) => value && optionsMap[value]?.name, getOptionValue, config)
      }
      renderSearchSuffix={
        immModalsV2.isEnabled
          ? ({ searchLabel }) => <IconButton size={16} icon="plus" variant={IconButton.Variant.BASIC} onClick={() => onCreate(searchLabel)} />
          : null
      }
      clearOnSelectActive
      renderFooterAction={({ close, searchLabel }) => (
        <NestedMenuComponents.FooterActionContainer onClick={Utils.functional.chainVoid(close, () => onCreate(searchLabel))}>
          Create New Entity
        </NestedMenuComponents.FooterActionContainer>
      )}
      createInputPlaceholder="entities"
    />
  );
};

export default EntitySelector;
