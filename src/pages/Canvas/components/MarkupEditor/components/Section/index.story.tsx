import { action } from '@storybook/addon-actions';
import { text } from '@storybook/addon-knobs';
import React from 'react';

import Section, { SectionProps } from '.';

export default {
  title: 'Creator/Markup Editor/Section',
  component: Section,
};

const createStory = (props?: SectionProps) => () => (
  <div style={{ maxWidth: '400px', margin: '50px auto' }}>
    <Section title={text('title', 'Title')} {...props}>
      {text('children', 'children')}
    </Section>
  </div>
);

export const normal = createStory();

export const add = createStory({
  opened: false,
  onAddRemove: action('onAddRemove'),
});

export const remove = createStory({
  opened: true,
  onAddRemove: action('onAddRemove'),
});

export const last = createStory({
  opened: true,
  isLast: true,
  onAddRemove: action('onAddRemove'),
});
