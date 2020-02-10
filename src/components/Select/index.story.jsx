import { boolean, text } from '@storybook/addon-knobs';
import _shuffle from 'lodash/shuffle';
import React from 'react';

import SvgIcon from '@/components/SvgIcon';
import * as ICONS from '@/svgs';

import Select, { defaultLabelRenderer } from '.';

const ICONS_NAMES = Object.keys(ICONS);
const DEFAULT_OPTIONS = Array.from({ length: 10 }, (_, i) => `option ${i}`);
const DEFAULT_OPTIONS_WITH_ICONS = Array.from({ length: 10 }, (_, i) => ({ label: `option ${i}`, value: i, icon: ICONS_NAMES[i] }));
const DEFAULT_GROUPED_MULTILEVEL_OPTIONS = Array.from({ length: 5 }, (_, i) => ({
  value: `${i}`,
  label: `option ${i}`,
  options: Array.from({ length: 5 }, (_, j) => ({
    value: `${i}-${j}`,
    label: `option ${i}-${j}`,
    options: Array.from({ length: 5 }, (_, k) => ({ value: `${i}-${j}-${k}`, label: `option ${i}-${j}-${k}` })),
  })),
}));
const GROUPED_OPTION_LABELS = DEFAULT_GROUPED_MULTILEVEL_OPTIONS.flatMap(({ label, value, options }) => [
  { value, label },
  ...options.flatMap(({ label, value, options }) => [{ value, label }, ...options]),
]).reduce((obj, option) => Object.assign(obj, { [option.value]: option.label }), {});

const getProps = () => {
  const [value, setValue] = React.useState();
  const [options, setSimpleOptions] = React.useState(DEFAULT_OPTIONS);

  const onCreate = React.useCallback(
    (simpleValue) => {
      setSimpleOptions((opts) => [...opts, simpleValue]);
      setValue(simpleValue);
    },
    [setValue, setSimpleOptions]
  );

  return {
    value,
    inline: boolean('inline', false),
    options,
    onSelect: setValue,
    onCreate,
    placeholder: text('Placeholder', 'placeholder'),
    createInputPlaceholder: text('Create Prompt Placeholder', 'create placeholder'),
  };
};

const getGroupedProps = () => ({
  ...getProps(),
  options: DEFAULT_GROUPED_MULTILEVEL_OPTIONS,
  searchable: true,
  getOptionValue: (option) => option?.value,
  getOptionLabel: (value) => GROUPED_OPTION_LABELS[value],
});

export default {
  title: 'Select',
  component: Select,
  includeStories: [],
};

export const normal = () => (
  <div style={{ width: '300px' }}>
    <Select {...getProps()} />
  </div>
);

export const dropdown = () => (
  <div style={{ width: '300px' }}>
    <Select label={text('label', 'dropdown')} {...getProps()} value={null} />
  </div>
);

export const grouped = () => (
  <div style={{ width: '300px' }}>
    <Select {...getGroupedProps()} grouped />
  </div>
);

export const multilevel = () => (
  <div style={{ width: '300px' }}>
    <Select {...getGroupedProps()} multiLevelDropdown />
  </div>
);

export const searchable = () => (
  <div style={{ width: '300px' }}>
    <Select {...getProps()} searchable />
  </div>
);

export const creatable = () => (
  <div style={{ width: '300px' }}>
    <Select {...getProps()} creatable createInputPlaceholder="create placeholder" />
  </div>
);

export const creatableAndSearchable = () => (
  <div style={{ width: '300px' }}>
    <Select {...getProps()} creatable searchable createInputPlaceholder="create placeholder" />
  </div>
);

export const customLabel = () => {
  const [value, setValue] = React.useState();
  const [options, setOptions] = React.useState(DEFAULT_OPTIONS_WITH_ICONS);
  const optionsMap = React.useMemo(() => options.reduce((obj, option) => Object.assign(obj, { [option.value]: option }), {}), [options]);

  const onCreate = React.useCallback(
    (label) => {
      const newValue = options.length;

      setOptions([...options, { value: newValue, label, icon: _shuffle(ICONS_NAMES)[0] }]);
      setValue(newValue);
    },
    [options, setValue, setOptions]
  );

  return (
    <div style={{ width: '300px' }}>
      <Select
        value={value}
        options={options}
        onSelect={setValue}
        onCreate={onCreate}
        creatable
        searchable
        placeholder={text('Placeholder', 'placeholder')}
        getOptionValue={(option) => option.value}
        getOptionLabel={(optionValue) => optionsMap[optionValue]?.label}
        renderOptionLabel={(option, searchLabel, getOptionLabel, getOptionValue) => (
          <>
            <SvgIcon icon={option.icon} />
            {defaultLabelRenderer(option, searchLabel, getOptionLabel, getOptionValue)}
          </>
        )}
        createInputPlaceholder={text('Create Prompt Placeholder', 'create placeholder')}
      />
    </div>
  );
};
