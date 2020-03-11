import { action } from '@storybook/addon-actions';
import React from 'react';

import { withStepDispatcher } from '@/../.storybook';
import { PLATFORMS } from '@/constants';
import { CommandStep } from '@/pages/Canvas/managers/Command/CommandStep';

import StartBlock, { FlowStartBlock, HomeStartBlock } from '.';

const COMMANDS = [
  { name: 'Help', flowID: '1', nodeID: 'x' },
  { name: 'Stop', flowID: '2', nodeID: 'y' },
].map((command) => <CommandStep {...command} onCommandClick={action('click command')} key={command.nodeID} />);

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

export const alexa = withStepDispatcher()(() => <HomeStartBlock platform={PLATFORMS[0]} invocationName="Headspace" {...getHomeProps()} />);

export const google = withStepDispatcher()(() => <HomeStartBlock platform={PLATFORMS[1]} invocationName="Headspace" {...getHomeProps()} />);

export const flowStartBlock = withStepDispatcher()(() => <FlowStartBlock name="Flow Name" {...getFlowProps()} commands={null} />);

export const flowWithCommands = withStepDispatcher()(() => <FlowStartBlock name="Flow Name" {...getFlowProps()} />);

export const flowConnected = withStepDispatcher({ hasActiveLinks: true })(() => <FlowStartBlock name="Flow Name" {...getFlowProps()} />);
