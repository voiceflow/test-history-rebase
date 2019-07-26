import { State, Store } from '@sambego/storybook-state';
import { storiesOf } from '@storybook/react';
import React from 'react';

import Tabs from '.';

const store = new Store({
  selected: -1,
});

storiesOf('Tabs', module).add('uncontrolled', () => (
  <div style={{ height: 50 }}>
    <State store={store}>
      {(state) => (
        <Tabs
          options={[{ value: 'abc', label: 'ABC' }, { value: 'def', label: 'DEF' }]}
          selected={state.selected}
          onChange={(selected) => store.set({ selected })}
        />
      )}
    </State>
  </div>
));
