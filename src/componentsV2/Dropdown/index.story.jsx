import { number, select } from '@storybook/addon-knobs';
import React from 'react';

import IconButton from '@/componentsV2/IconButton';

import Dropdown from '.';

const PLACEMENT_OPTIONS = {
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
};

const getOptions = (options) =>
  Array.from({ length: options }, (_, index) => ({
    value: {
      id: `opt${index + 1}`,
    },
    label: `Option ${index + 1}`,
  }));

const getProps = () => ({
  options: number('# Options', 4),
  placement: select('Placement', PLACEMENT_OPTIONS),
});

export default {
  title: 'Dropdown',
  component: Dropdown,
};

export const normal = () => {
  const { options, ...props } = getProps();

  return (
    <Dropdown options={getOptions(options)} {...props}>
      {(ref, onToggle, isOpen) => <IconButton active={isOpen} variant="flat" icon="back" size={15} onClick={onToggle} ref={ref} />}
    </Dropdown>
  );
};

export const withCustomMenu = () => {
  const { options, ...props } = getProps();

  return (
    <Dropdown menu={<h1>This is a custom menu</h1>} {...props}>
      {(ref, onToggle, isOpen) => <IconButton active={isOpen} variant="flat" icon="back" size={15} onClick={onToggle} ref={ref} />}
    </Dropdown>
  );
};

export const withCustomButton = () => {
  const { options, ...props } = getProps();

  return (
    <Dropdown menu={<h1>This is a custom menu</h1>} {...props}>
      {(ref, onToggle) => (
        <button onClick={onToggle} ref={ref}>
          Custom Element
        </button>
      )}
    </Dropdown>
  );
};
