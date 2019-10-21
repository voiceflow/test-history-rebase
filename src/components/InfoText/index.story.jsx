import { text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';

import Variant from '@/../.storybook/Variant';

import InfoText from '.';

storiesOf('Info Text', module).add('variants', () => {
  const label = text('Label', 'Informative Text');

  return (
    <>
      <Variant label="info">
        <InfoText>{label}</InfoText>
      </Variant>
      <Variant label="warn">
        <InfoText variant="warn">{label}</InfoText>
      </Variant>
    </>
  );
});
