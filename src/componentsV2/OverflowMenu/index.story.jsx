import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';

import OverflowMenu from '.';

storiesOf('Overflow Menu', module).add('variants', () => {
  const disabled = boolean('Disabled', false);

  return <OverflowMenu options={[]} disabled={disabled} onClick={action('click')} />;
});
