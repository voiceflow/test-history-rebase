import { number, select } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { Variant, createTestableStory } from '@/../.storybook';
import RoundButton from '@/components/Button/RoundButton';

import Dropdown from '.';

const MENU_OPTIONS = (options) =>
  Array.from({ length: options }, (_, index) => ({
    value: {
      id: `opt${index + 1}`,
    },
    label: `Option ${index + 1}`,
  }));

storiesOf('Regular Dropdown', module).add(
  'variants',
  createTestableStory(() => {
    const options = number('# Options', 4);
    const placement = select('Placement', {
      Auto: 'auto',
      Top: 'top',
      Right: 'right',
      Left: 'left',
      Bottom: 'bottom',
      'Top-Start': 'top-start',
      'Top-End': 'top-end',
      'Right-Start': 'right-start',
      'Right-End': 'right-end',
      'Left-Start': 'left-start',
      'Left-End': 'left-end',
      'Bottom-End': 'bottom-end',
      'Bottom-Start': 'bottom-start',
    });

    return (
      <>
        <Variant label="Round Button w/ Options Menu">
          <Dropdown options={MENU_OPTIONS(options)} placement={placement}>
            {(ref, onToggle) => <RoundButton icon="back" imgSize={15} onClick={onToggle} innerRef={ref} />}
          </Dropdown>
        </Variant>

        <Variant label="Round Button w/ Custom Menu">
          <Dropdown menu={<h1>This is a custom menu</h1>} placement={placement}>
            {(ref, onToggle) => <RoundButton icon="back" imgSize={15} onClick={onToggle} innerRef={ref} />}
          </Dropdown>
        </Variant>

        <Variant label="Element w/ Custom Menu">
          <Dropdown menu={<h1>This is a custom menu</h1>} placement={placement}>
            {(ref, onToggle) => (
              <button onClick={onToggle} ref={ref}>
                Custom Element
              </button>
            )}
          </Dropdown>
        </Variant>
      </>
    );
  })
);
