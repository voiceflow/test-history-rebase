import { text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';

import PhonePreview from '.';

storiesOf('Phone Preview', module).add('uncontrolled', () => {
  const imageLink = text('Image Link', '/permissions.png');

  return <PhonePreview image={imageLink} />;
});
