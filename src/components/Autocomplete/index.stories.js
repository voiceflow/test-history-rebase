/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';

import centered from '@storybook/addon-centered';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import { text, object, boolean, select, withKnobs } from '@storybook/addon-knobs';

import { convertArrayToSelect } from 'stories/lib/helpers';

import Autocomplete from './index';

const options = [
  { id: '1', label: 'Option 1' },
  { id: '2', label: 'Option 2' },
  { id: '3', label: 'Option 3' },
];

const optionsWithLevels = [
  { id: '1', label: 'Option 1', level: 1 },
  { id: '1.1', label: 'Option 1.1', level: 2 },
  { id: '2', label: 'Option 2' },
  { id: '2.1', label: 'Option 2.1', level: 2 },
  { id: '3', label: 'Option 3', level: 1 },
  { id: '3.1', label: 'Option 3.1', level: 2 },
];

storiesOf('components/Autocomplete', module)
  .addDecorator(centered)
  .addDecorator(withKnobs)
  .add('default', () => (
    <Autocomplete
      value={select('value', convertArrayToSelect(options))}
      onShow={action('onShow')}
      onHide={action('onHide')}
      options={object('options', options)}
      onSelect={action('onSelect')}
    />
  ))
  .add('with selected value', () => (
    <Autocomplete
      value={select('value', convertArrayToSelect(options), '1')}
      onShow={action('onShow')}
      onHide={action('onHide')}
      options={object('options', options)}
      onSelect={action('onSelect')}
    />
  ))
  .add('with custom value', () => (
    <Autocomplete
      value={text('value', 'some value')}
      onShow={action('onShow')}
      onHide={action('onHide')}
      onBlur={action('onBlur')}
      options={object('options', options)}
      onSelect={action('onSelect')}
    />
  ))
  .add('with remove selected value', () => (
    <Autocomplete
      value={select('value', convertArrayToSelect(options), '1')}
      onShow={action('onShow')}
      onHide={action('onHide')}
      options={object('options', options)}
      onSelect={action('onSelect')}
      removeSelectedValue={boolean('removeSelectedValue', true)}
    />
  ))
  .add('with clear button', () => (
    <Autocomplete
      value={select('value', convertArrayToSelect(options), '1')}
      onShow={action('onShow')}
      onHide={action('onHide')}
      options={object('options', options)}
      onClear={action('onClear')}
      onSelect={action('onSelect')}
      isClearable={boolean('isClearable', true)}
      removeSelectedValue={boolean('removeSelectedValue', true)}
    />
  ))
  .add('with level', () => (
    <Autocomplete
      value={select('value', convertArrayToSelect(options), '1.1')}
      onShow={action('onShow')}
      onHide={action('onHide')}
      options={object('options', optionsWithLevels)}
      onClear={action('onClear')}
      onSelect={action('onSelect')}
      isClearable={boolean('isClearable', true)}
      removeSelectedValue={boolean('removeSelectedValue', true)}
    />
  ))
  .add('with footer', () => (
    <Autocomplete
      value={select('value', convertArrayToSelect(options), '1')}
      onShow={action('onShow')}
      onHide={action('onHide')}
      options={object('options', optionsWithLevels)}
      onClear={action('onClear')}
      onSelect={action('onSelect')}
      isClearable={boolean('isClearable', true)}
      footerRenderer={() => 'Footer renderer'}
      removeSelectedValue={boolean('removeSelectedValue', true)}
    />
  ));
