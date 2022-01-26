import { Nullish, Utils } from '@voiceflow/common';
import { FlexApart, FlexStart, NestedMenuComponents, Select, SelectInputVariant, stopImmediatePropagation } from '@voiceflow/ui';
import React from 'react';

import Checkbox from '@/components/Checkbox';

import { TagSelectProps } from './types';

const trimNulls = (list: Nullish<string>[]): string[] => list.filter(Boolean) as string[];

const customMenuLabelRenderer = (label: string, value: string, isSelectedFunc: (val: string) => boolean) => (
  <FlexApart style={{ width: '100%' }}>
    <FlexStart>
      <Checkbox readOnly checked={isSelectedFunc(value)} />
      <div data-testid={value}>{label}</div>
    </FlexStart>
  </FlexApart>
);

const TagSelect = <O extends unknown>({
  createInputPlaceholder,
  getOptionLabel,
  getOptionValue,
  onChange,
  options,
  placeholder = 'Select all that apply',
  value,
}: TagSelectProps<O, string>): JSX.Element => {
  const [selected, setSelected] = React.useState<string[]>([]);

  React.useEffect(() => {
    setSelected(trimNulls(value));
  }, [value]);

  const labels = React.useMemo(
    () =>
      options.reduce<Map<Nullish<string>, Nullish<string>>>(
        (map, next) => map.set(getOptionValue(next), getOptionLabel(next)),
        new Map<Nullish<string>, Nullish<string>>()
      ),
    [options]
  );

  const selectedAllIntents = selected.length === options.length;

  const handleSelect = (option: O) => {
    const optionValue = getOptionValue?.(option);
    if (optionValue) {
      onChange(Utils.array.toggleMembership(selected, optionValue));
    }
  };

  const toggleSelectAll = () => {
    onChange(selectedAllIntents ? [] : trimNulls(options.map(getOptionValue)));
  };

  const isOptionSelected = (optionID: string) => selected.includes(optionID);

  return (
    <Select
      autoWidth
      renderOptionLabel={(option) => customMenuLabelRenderer(getOptionLabel(option) || '', getOptionValue(option) || '', isOptionSelected)}
      footerAction={(hideMenu) => (
        <NestedMenuComponents.FooterActionContainer
          onClick={stopImmediatePropagation(() => {
            hideMenu();
            toggleSelectAll();
          })}
        >
          {selectedAllIntents ? 'Unselect all' : 'Select all'}
        </NestedMenuComponents.FooterActionContainer>
      )}
      fullWidth
      selectedOptions={selected}
      options={options}
      withSearchIcon
      inDropdownSearch
      searchable
      alwaysShowCreate
      autoDismiss={false}
      getOptionLabel={getOptionLabel}
      placeholder={placeholder}
      displayName={selected.map((id) => labels.get(id)).join(', ')}
      onSelect={handleSelect}
      inputVariant={SelectInputVariant.COUNTER}
      createInputPlaceholder={createInputPlaceholder}
    />
  );
};

export default TagSelect;
