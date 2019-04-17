/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';

import centered from '@storybook/addon-centered';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import { text, object, number, withKnobs } from '@storybook/addon-knobs';

import InputList from './index';

storiesOf('components/InputList', module)
  .addDecorator(centered)
  .addDecorator(withKnobs)
  .add('default', () => (
    <InputList
      onAdd={action('onAdd')}
      values={object('values', [])}
      onChange={action('onChange')}
      onRemove={action('onRemove')}
    />
  ))
  .add('with placeholders', () => (
    <InputList
      onAdd={action('onAdd')}
      values={object('values', ['', '', ''])}
      onChange={action('onChange')}
      onRemove={action('onRemove')}
      placeholders={object('placeholders', ['placeholder 1', 'placeholder 2', 'placeholder 3'])}
    />
  ))
  .add('with shared placeholder', () => (
    <InputList
      onAdd={action('onAdd')}
      values={object('values', ['', '', ''])}
      onChange={action('onChange')}
      onRemove={action('onRemove')}
      placeholder={text('placeholder', 'placeholder')}
    />
  ))
  .add('with input props', () => (
    <InputList
      onAdd={action('onAdd')}
      values={object('values', ['', '', ''])}
      onChange={action('onChange')}
      onRemove={action('onRemove')}
      placeholder={text('placeholder', 'placeholder')}
      {...object('input props', {
        showCounter: 'onFocus',
        counterProps: { limit: 200, absolute: true, withDangerLabel: true },
      })}
    />
  ))
  .add('with texts', () => (
    <InputList
      onAdd={action('onAdd')}
      values={object('values', ['1', '', '3'])}
      onChange={action('onChange')}
      onRemove={action('onRemove')}
      placeholders={object('placeholders', ['placeholder 1', 'placeholder 2', 'placeholder 3'])}
    />
  ))
  .add('with objects', () => (
    <InputList
      onAdd={action('onAdd')}
      values={object('values', [
        { key: 'key 1', value: '1' },
        { key: 'key 2', value: '2' },
        { key: 'key 3', value: '3' },
      ])}
      onChange={action('onChange')}
      onRemove={action('onRemove')}
      placeholders={object('placeholders', ['placeholder 1', 'placeholder 2', 'placeholder 3'])}
    />
  ))
  .add('with secondRowRenderer', () => (
    <InputList
      onAdd={action('onAdd')}
      values={object('values', [
        { key: 'key 1', value: '1' },
        { key: 'key 2', value: '2' },
        { key: 'key 3', value: '3' },
      ])}
      onChange={action('onChange')}
      onRemove={action('onRemove')}
      placeholders={object('placeholders', ['placeholder 1', 'placeholder 2', 'placeholder 3'])}
      secondRowRenderer={value => <p>key: {value.key}</p>}
    />
  ))
  .add('with minLength', () => (
    <InputList
      onAdd={action('onAdd')}
      values={object('values', ['1', ''])}
      onChange={action('onChange')}
      onRemove={action('onRemove')}
      minLength={number('minLength', 2)}
      placeholders={object('placeholders', ['placeholder 1', 'placeholder 2'])}
    />
  ))
  .add('with maxLength', () => (
    <InputList
      onAdd={action('onAdd')}
      values={object('values', ['1', '2', '3', '4'])}
      onChange={action('onChange')}
      onRemove={action('onRemove')}
      minLength={number('minLength', 2)}
      maxLength={number('maxLength', 4)}
      placeholders={object('placeholders', ['placeholder 1', 'placeholder 2'])}
    />
  ))
  .add('with errors', () => (
    <InputList
      onAdd={action('onAdd')}
      values={object('values', ['1', '', '3'])}
      errors={object('errors', ['errors 1', 'error 2', 'error 3'])}
      onChange={action('onChange')}
      onRemove={action('onRemove')}
      placeholders={object('placeholders', ['placeholder 1', 'placeholder 2', 'placeholder 3'])}
    />
  ));
