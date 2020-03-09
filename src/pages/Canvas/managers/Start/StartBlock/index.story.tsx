import { action } from '@storybook/addon-actions';
import React from 'react';

import { withEngine } from '@/../.storybook';
import { PLATFORMS } from '@/constants';

import StartBlock from '.';

const withDispatcher = withEngine({
  dispatcher: {
    usePort: () => ({ onClick: () => null }),
    useNode: () => ({}),
  },
});

const getProps = () => ({
  onCommandClick: action('click command'),
});

const getHomeProps = () => ({
  ...getProps(),
  commands: [
    { name: 'Help', flowID: '1', portID: 'a', isActive: false },
    { name: 'Stop', flowID: '2', portID: 'b', isActive: false },
  ],
});

const getFlowProps = () => ({
  ...getProps(),
  commands: [
    { name: 'Flow Command', flowID: '1', portID: 'a', isActive: false },
    { name: 'Contextualized Help', flowID: '2', portID: 'b', isActive: true },
  ],
});

export default {
  title: 'Creator/Start Block',
  component: StartBlock,
};

export const alexa = withDispatcher(() => <StartBlock platform={PLATFORMS[0]} invocationName="Headspace" {...getHomeProps()} />);

export const google = withDispatcher(() => <StartBlock platform={PLATFORMS[1]} invocationName="Headspace" {...getHomeProps()} />);

export const flowStartBlock = withDispatcher(() => (
  <StartBlock platform={PLATFORMS[0]} invocationName="Headspace" inFlow={true} flowName="Flow Name" />
));

export const flowWithCommands = withDispatcher(() => <StartBlock inFlow={true} flowName="Flow Name" {...getFlowProps()} />);
