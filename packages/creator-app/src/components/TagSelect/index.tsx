import { Nullish, Utils } from '@voiceflow/common';
import {
  defaultMenuLabelRenderer,
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
  UIOnlyMenuItemOption,
} from '@voiceflow/ui';
import React from 'react';

import Checkbox from '@/components/Checkbox';
import { useDidUpdateEffect } from '@/hooks';

import { PrimitiveTagSelectProps, TagSelectInternalProps, TagSelectProps } from './types';

const trimNulls = (list: Nullish<string>[]): string[] => list.filter(Boolean) as string[];

const customMenuLabelRenderer = <Option extends unknown>(
  option: Exclude<Option, UIOnlyMenuItemOption>,
  searchLabel: string,
  getOptionLabel: GetOptionLabel<string>,
  getOptionValue: GetOptionValue<Option, string>,
  isSelected: (val: string) => boolean
) => {
  const value = getOptionValue(option);

  return (
    <FlexApart style={{ width: '100%' }}>
      <FlexStart>
        <Checkbox readOnly checked={!!value && isSelected(value)} />
        <div data-testid={value}>{defaultMenuLabelRenderer(option, searchLabel, getOptionLabel, getOptionValue)}</div>
      </FlexStart>
    </FlexApart>
  );
};

const defaultGetter = (option: unknown) => option;

function TagSelect<Option extends Primitive>(props: PrimitiveTagSelectProps<Option>): React.ReactElement;
function TagSelect<Option>(props: TagSelectProps<Option>): React.ReactElement;
function TagSelect({
  value,
  options,
  onChange,
  disabled,
  maxHeight,
  placeholder = 'Select intents to export',
  isDropdown = true,
  getOptionLabel = defaultGetter as GetOptionLabel<unknown>,
  getOptionValue = defaultGetter as GetOptionValue<unknown, string>,
  getOptionKey = (option, index) => String(getOptionValue(option) || index),
  createInputPlaceholder,
  error,
  useLayers,
}: TagSelectInternalProps): React.ReactElement {
  const [selected, setSelected] = React.useState<string[]>(() => trimNulls(value));

  const tagsOnly = React.useMemo(() => options.filter(isNotUIOnlyMenuItemOption), [options]);

  const selectedAllIntents = selected.length === options.length;

  const onSelect = (value: string | null) => {
    if (value) {
      onChange(Utils.array.toggleMembership(selected, value));
    }
  };

  const toggleSelectAll = () => {
    onChange(selectedAllIntents ? [] : trimNulls(tagsOnly.map(getOptionValue)));
  };

  const isOptionSelected = (optionID: string) => selected.includes(optionID);

  useDidUpdateEffect(() => setSelected(trimNulls(value)), [value]);

  return (
    <Select<unknown, string>
      autoWidth
      renderOptionLabel={(option, searchLabel, getOptionLabel, getOptionValue) =>
        customMenuLabelRenderer(option, searchLabel, getOptionLabel, getOptionValue, isOptionSelected)
      }
      renderFooterAction={({ close }) => (
        <NestedMenuComponents.FooterActionContainer onClick={stopImmediatePropagation(Utils.functional.chainVoid(close, toggleSelectAll))}>
          {selectedAllIntents ? 'Unselect All' : 'Select All'}
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
      getOptionValue={getOptionValue}
      getOptionLabel={getOptionLabel}
      placeholder={placeholder}
      displayName={selected
        .map((value) => getOptionLabel(value))
        .filter(Boolean)
        .join(', ')}
      onSelect={onSelect}
      inputVariant={SelectInputVariant.COUNTER}
      createInputPlaceholder={createInputPlaceholder}
      disabled={disabled}
      getOptionKey={getOptionKey}
      error={error}
      maxHeight={maxHeight}
      useLayers={useLayers}
    />
  );
}

export default TagSelect;
