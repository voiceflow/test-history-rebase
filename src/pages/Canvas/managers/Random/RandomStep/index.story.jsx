import { action } from '@storybook/addon-actions';
import React from 'react';

import { withEngine } from '@/../.storybook';
import NewBlock from '@/pages/Canvas/components/Block/NewBlock';

import { RandomStep } from '.';

const withDispatcher = ({ hasActiveLinks = false, onClick = action('click port') } = {}) =>
  withEngine({
    dispatcher: {
      usePort: () => ({ hasActiveLinks, onClick }),
      useNode: () => ({}),
    },
  });

const getProps = () => ({
  ports: ['abc'],
});

export default {
  title: 'Creator/Steps/Random Step',
  component: RandomStep,
};

export const singlePath = withDispatcher()(() => (
  <NewBlock name="Random Block">
    <RandomStep {...getProps()} />
  </NewBlock>
));

export const manyPaths = withDispatcher()(() => (
  <NewBlock name="Random Block">
    <RandomStep {...getProps()} ports={['abc', 'def', 'ghi']} />
  </NewBlock>
));

export const active = withDispatcher()(() => (
  <NewBlock name="Random Block">
    <RandomStep {...getProps()} isActive />
  </NewBlock>
));

// eslint-disable-next-line sonarjs/no-identical-functions
export const connected = withDispatcher({ hasActiveLinks: true })(() => (
  <NewBlock name="Random Block">
    <RandomStep {...getProps()} />
  </NewBlock>
));
