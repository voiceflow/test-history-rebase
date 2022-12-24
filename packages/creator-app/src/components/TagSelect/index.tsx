import { Nullish, Utils } from '@voiceflow/common';
import {
  BaseSelectProps,
  Checkbox,
  defaultMenuLabelRenderer,
  FlexApart,
  FlexStart,
  GetOptionLabel,
  GetOptionValue,
  isNotUIOnlyMenuItemOption,
  Menu,
  Primitive,
  Select,
  SelectInputVariant,
  stopImmediatePropagation,
  UIOnlyMenuItemOption,
  useDidUpdateEffect,
} from '@voiceflow/ui';
import React from 'react';

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
  id,
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
  renderEmpty,
  useLayers,
  selectAllLabel = 'Select All',
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

  // props only when options > 0
  const optionProps: Pick<BaseSelectProps, 'renderFooterAction' | 'searchable' | 'inDropdownSearch'> =
    options.length > 0
      ? {
          renderFooterAction: ({ close }) => (
            <Menu.Footer>
              <Menu.Footer.Action onClick={stopImmediatePropagation(Utils.functional.chainVoid(close, toggleSelectAll))}>
                {selectedAllIntents ? 'Unselect All' : selectAllLabel}
              </Menu.Footer.Action>
            </Menu.Footer>
          ),
          searchable: true,
          inDropdownSearch: true,
        }
      : {
          searchable: true, // We want to keep the search field even if no options to display, This can be changes later (NLU-447)
          inDropdownSearch: true,
        };

  return (
    <Select<unknown, string>
      id={id}
      autoWidth
      renderOptionLabel={(option, searchLabel, getOptionLabel, getOptionValue) =>
        customMenuLabelRenderer(option, searchLabel, getOptionLabel, getOptionValue, isOptionSelected)
      }
      fullWidth
      selectedOptions={selected}
      options={options}
      isDropdown={isDropdown}
      labelSearchable={false}
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
      renderEmpty={renderEmpty}
      maxHeight={maxHeight}
      useLayers={useLayers}
      {...optionProps}
    />
  );
}

export default TagSelect;
