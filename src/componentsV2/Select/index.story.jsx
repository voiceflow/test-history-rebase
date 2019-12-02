/* eslint-disable sonarjs/no-identical-functions */
import { storiesOf } from '@storybook/react';
import _shuffle from 'lodash/shuffle';
import React from 'react';

import { Variant, createTestableStory } from '@/../.storybook';
import SvgIcon from '@/components/SvgIcon';
import * as ICONS from '@/svgs';

import Select, { defaultOptionLabelRenderer } from '.';

const ICONS_NAMES = Object.keys(ICONS);
const DEFAULT_OPTIONS = Array.from({ length: 10 }, (_, i) => `option ${i}`);
const DEFAULT_OPTIONS_WITH_ICONS = Array.from({ length: 10 }, (_, i) => ({ label: `option ${i}`, value: i, icon: ICONS_NAMES[i] }));

storiesOf('Select', module).add(
  'variants',
  createTestableStory(() => {
    const [simpleValue, setSimpleValue] = React.useState();
    const [simpleOptions, setSimpleOptions] = React.useState(DEFAULT_OPTIONS);

    const onCreateSimple = React.useCallback(
      (simpleValue) => {
        setSimpleOptions((opts) => [...opts, simpleValue]);
        setSimpleValue(simpleValue);
      },
      [setSimpleValue, setSimpleOptions]
    );

    const [value, setValue] = React.useState();
    const [options, setOptions] = React.useState(DEFAULT_OPTIONS_WITH_ICONS);

    const onCreate = React.useCallback(
      (label) => {
        const newValue = options.length;

        setOptions([...options, { value: newValue, label, icon: _shuffle(ICONS_NAMES)[0] }]);
        setValue(newValue);
      },
      [options, setValue, setOptions]
    );

    const optionsMap = React.useMemo(() => options.reduce((obj, option) => Object.assign(obj, { [option.value]: option }), {}), [options]);

    return (
      <>
        <Variant label="default">
          <div style={{ width: '300px' }}>
            <Select value={simpleValue} options={simpleOptions} onSelect={setSimpleValue} placeholder="placeholder" />
          </div>
        </Variant>

        <Variant label="searchable">
          <div style={{ width: '300px' }}>
            <Select value={simpleValue} options={simpleOptions} onSelect={setSimpleValue} placeholder="placeholder" searchable />
          </div>
        </Variant>

        <Variant label="creatable">
          <div style={{ width: '300px' }}>
            <Select
              value={simpleValue}
              options={simpleOptions}
              onSelect={setSimpleValue}
              onCreate={onCreateSimple}
              creatable
              placeholder="placeholder"
              createInputPlaceholder="create placeholder"
            />
          </div>
        </Variant>

        <Variant label="creatable-searchable">
          <div style={{ width: '300px' }}>
            <Select
              value={simpleValue}
              options={simpleOptions}
              onSelect={setSimpleValue}
              onCreate={onCreateSimple}
              creatable
              searchable
              placeholder="placeholder"
              createInputPlaceholder="create placeholder"
            />
          </div>
        </Variant>

        <Variant label="custom label renderer">
          <div style={{ width: '300px' }}>
            <Select
              value={value}
              options={options}
              onSelect={setValue}
              onCreate={onCreate}
              creatable
              searchable
              placeholder="placeholder"
              getOptionValue={(option) => option.value}
              getOptionLabel={(optionValue) => optionsMap[optionValue]?.label}
              renderOptionLabel={(option, searchLabel, getOptionLabel, getOptionValue) => (
                <>
                  <SvgIcon icon={option.icon} />
                  {defaultOptionLabelRenderer(option, searchLabel, getOptionLabel, getOptionValue)}
                </>
              )}
              createInputPlaceholder="create placeholder"
            />
          </div>
        </Variant>
      </>
    );
  })
);
