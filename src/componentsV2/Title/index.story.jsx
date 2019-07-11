import { text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { FlexApart } from '../Flex';
import Title from '.';

storiesOf('Title', module).add('variants', () => {
  const label = text('Label', 'Title');

  return (
    <FlexApart>
      <Title>{label}</Title>
      <Title variant="subheading">{label}</Title>
      <Title variant="subtitle">{label}</Title>
      <Title variant="label">{label}</Title>
    </FlexApart>
  );
});
