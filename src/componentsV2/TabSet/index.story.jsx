import { storiesOf } from '@storybook/react';
import React from 'react';

import { Container as Tab } from '@/componentsV2/Tab';

import TabSet from '.';

storiesOf('Tab Set', module).add('variants', () => (
  <TabSet style={{ height: 50 }}>
    <Tab>Basic Tab</Tab>
    <Tab>Other Tab</Tab>
    <Tab isActive>Active Tab</Tab>
  </TabSet>
));
