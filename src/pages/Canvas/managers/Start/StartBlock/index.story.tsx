import { composeDecorators2, withContext, withStepContext } from '_storybook';
import { action } from '@storybook/addon-actions';
import React from 'react';

import { DISTINCT_PLATFORMS } from '@/constants';
import { NodeEntityContext } from '@/pages/Canvas/contexts';
import { CommandStep } from '@/pages/Canvas/managers/Command/CommandStep';

import StartBlock, { FlowStartBlock, HomeStartBlock } from '.';

const COMMANDS = [
  { name: 'Help', flowID: '1', nodeID: 'x' },
  { name: 'Stop', flowID: '2', nodeID: 'y' },
].map((command) => <CommandStep {...command} onCommandClick={action('click command')} key={command.nodeID} />);

const withDecorators = (...args: Parameters<typeof withStepContext>) =>
  composeDecorators2(
    withStepContext(...args),
    withContext(NodeEntityContext, {
      useState: () => ({}),
    })
  );

const getProps = () => ({
  onCommandClick: action('click command'),
  portID: 'abc',
  isActive: false,
});

const getHomeProps = () => ({
  ...getProps(),
  portID: 'abc',
  commands: COMMANDS,
});

const getFlowProps = () => ({
  ...getProps(),
  commands: COMMANDS,
});

export default {
  title: 'Creator/Start Block',
  component: StartBlock,
};

export const alexa = withDecorators()(() => <HomeStartBlock platform={DISTINCT_PLATFORMS[0]} invocationName="Headspace" {...getHomeProps()} />);

export const google = withDecorators()(() => <HomeStartBlock platform={DISTINCT_PLATFORMS[1]} invocationName="Headspace" {...getHomeProps()} />);

export const flowStartBlock = withDecorators()(() => <FlowStartBlock name="Flow Name" {...getFlowProps()} commands={null} />);

export const flowWithCommands = withDecorators()(() => <FlowStartBlock name="Flow Name" {...getFlowProps()} />);

export const flowConnected = withDecorators({ isConnected: true })(() => <FlowStartBlock name="Flow Name" {...getFlowProps()} />);
