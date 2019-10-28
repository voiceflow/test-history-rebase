import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { Variant, createTestableStory } from '@/../.storybook';

import Menu from '.';

storiesOf('Menu', module).add(
  'variants',
  createTestableStory(() => {
    const onSelect = action('select');

    return (
      <>
        <Variant label="basic">
          <Menu
            options={[
              {
                value: { id: 'opt1' },
                label: 'Grape Jelly',
              },
              {
                value: { id: 'opt2' },
                label: 'Mild Salsa',
              },
              {
                value: { id: 'opt3' },
                label: 'Hummus',
              },
              {
                value: { id: 'opt4' },
                label: 'Ranch Dressing',
              },
            ]}
            onSelect={onSelect}
          />
        </Variant>

        <Variant label="scrolling">
          <Menu
            options={Array(20)
              .fill(0)
              .map((_, index) => ({
                value: { id: `opt${index + 1}` },
                label: `Option ${index + 1}`,
              }))}
            onSelect={onSelect}
          />
        </Variant>

        <Variant label="thin">
          <Menu
            options={[
              {
                value: { id: 'opt1' },
                label: 'A',
              },
              {
                value: { id: 'opt2' },
                label: 'B',
              },
              {
                value: { id: 'opt3' },
                label: 'C',
              },
              {
                value: { id: 'opt4' },
                label: 'D',
              },
            ]}
            onSelect={onSelect}
          />
        </Variant>

        <Variant label="wide">
          <Menu
            options={[
              {
                value: { id: 'opt1' },
                label: 'Antidisestablishmentarianism',
              },
              {
                value: { id: 'opt2' },
                label: 'A Man, A Plan, A Canal: Panama',
              },
              {
                value: { id: 'opt3' },
                label: 'An option with a very very verrrrrrrrrrrrrrrrrrrrrrrrrry long label',
              },
              {
                value: { id: 'opt4' },
                label: 'this one is short',
              },
            ]}
            onSelect={onSelect}
          />
        </Variant>
      </>
    );
  })
);
