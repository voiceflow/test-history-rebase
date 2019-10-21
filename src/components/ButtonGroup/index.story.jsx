import { State, Store } from '@sambego/storybook-state';
import { storiesOf } from '@storybook/react';
import React from 'react';

import ButtonGroup from '.';

const OPTIONS = [
  {
    value: '1',
    label: 'First Option',
  },
  {
    value: '2',
    label: 'Second Option',
  },
  {
    value: '3',
    label: 'Third Option',
  },
];

const store = new Store({
  selected: 0,
});

storiesOf('Button Group', module).add('uncontrolled', () => (
  <State store={store}>
    {(state) => <ButtonGroup options={OPTIONS} selected={state.selected} onChange={(selected) => store.set({ selected })} />}
  </State>
));
