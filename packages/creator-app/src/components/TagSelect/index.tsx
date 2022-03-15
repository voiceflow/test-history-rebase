import { Nullish, Utils } from '@voiceflow/common';
import {
  FlexApart,
  FlexStart,
  GetOptionLabel,
  GetOptionValue,
  isNotUIOnlyMenuItemOption,
  NestedMenuComponents,
  Primitive,
  Select,
  SelectInputVariant,
  stopImmediatePropagation,
} from '@voiceflow/ui';
import React from 'react';

import Checkbox from '@/components/Checkbox';
import { useDidUpdateEffect } from '@/hooks';

import { PrimitiveTagSelectProps, TagSelectInternalProps, TagSelectProps } from './types';

const trimNulls = (list: Nullish<string>[]): string[] => list.filter(Boolean) as string[];

const customMenuLabelRenderer = (label: string, value: string, isSelectedFunc: (val: string) => boolean) => (
  <FlexApart style={{ width: '100%' }}>
    <FlexStart>
      <Checkbox readOnly checked={isSelectedFunc(value)} />
      <div data-testid={value}>{label}</div>
    </FlexStart>
  </FlexApart>
);

const defaultGetter = (option: unknown) => option;

function TagSelect<Option extends Primitive>(props: PrimitiveTagSelectProps<Option>): React.ReactElement;
function TagSelect<Option>(props: TagSelectProps<Option>): React.ReactElement;
function TagSelect({
  value,
  options,
  onChange,
  disabled,
  placeholder = 'Select all that apply',
  isDropdown = true,
  getOptionLabel = defaultGetter as GetOptionLabel<unknown>,
  getOptionValue = defaultGetter as GetOptionValue<unknown, string>,
  getOptionKey = (option, index) => String(getOptionValue(option) || index),
  createInputPlaceholder,
}: TagSelectInternalProps): React.ReactElement {
  const [selected, setSelected] = React.useState<string[]>(() => trimNulls(value));

  const tagsOnly = React.useMemo(() => options.filter(isNotUIOnlyMenuItemOption), [options]);

  const labels = React.useMemo(
    () => Object.fromEntries(tagsOnly.map((tag) => [getOptionValue(tag), getOptionLabel(tag)] as const)),
    [tagsOnly, getOptionValue, getOptionLabel]
  );

  const selectedAllIntents = selected.length === options.length;

  const handleSelect = (option: unknown) => {
    const optionValue = getOptionValue(option);

    if (optionValue) {
      onChange(Utils.array.toggleMembership(selected, optionValue));
    }
  };

  const toggleSelectAll = () => {
    onChange(selectedAllIntents ? [] : trimNulls(tagsOnly.map(getOptionValue)));
  };

  const isOptionSelected = (optionID: string) => selected.includes(optionID);

  useDidUpdateEffect(() => setSelected(trimNulls(value)), [value]);

  return (
    <Select
      autoWidth
      renderOptionLabel={(option) => customMenuLabelRenderer(String(getOptionLabel(option)) || '', getOptionValue(option) || '', isOptionSelected)}
      renderFooterAction={({ close }) => (
        <NestedMenuComponents.FooterActionContainer onClick={stopImmediatePropagation(Utils.functional.chainVoid(close, toggleSelectAll))}>
          {selectedAllIntents ? 'Unselect all' : 'Select all'}
        </NestedMenuComponents.FooterActionContainer>
      )}
      fullWidth
      selectedOptions={selected}
      options={options}
      isDropdown={isDropdown}
      inDropdownSearch
      labelSearchable={false}
      searchable
      alwaysShowCreate
      autoDismiss={false}
      getOptionValue={(option) => option}
      getOptionLabel={getOptionLabel}
      placeholder={placeholder}
      displayName={selected.map((id) => labels[id]).join(', ')}
      onSelect={handleSelect}
      inputVariant={SelectInputVariant.COUNTER}
      createInputPlaceholder={createInputPlaceholder}
      disabled={disabled}
      getOptionKey={getOptionKey}
    />
  );
}

export default TagSelect;
