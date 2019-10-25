import { storiesOf } from '@storybook/react';
import React from 'react';

import Variant from '@/../.storybook/Variant';

import Checkbox from './index';

storiesOf('Checkbox', module).add('variants', () =>
  React.createElement(() => {
    const [checked, setChecked] = React.useState(false);

    return (
      <Variant label="Check box">
        <div className="pb-3 pa__form_container">
          <Checkbox value={checked} checked={checked} onChange={() => setChecked(!checked)}>
            <span>check box</span>
          </Checkbox>
        </div>
      </Variant>
    );
  })
);
