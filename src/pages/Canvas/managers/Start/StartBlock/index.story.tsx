import { action } from '@storybook/addon-actions';
import React from 'react';

import { PLATFORMS } from '@/constants';

import StartBlock from '.';

export default {
  title: 'Creator/Start Block',
  component: StartBlock,
};

const getProps = () => ({
  onCommandClick: action('click command'),
});

const getHomeProps = () => ({
  ...getProps(),
  commands: [
    { name: 'Help', flowID: '1', isActive: false },
    { name: 'Stop', flowID: '2', isActive: false },
  ],
});

const getFlowProps = () => ({
  ...getProps(),
  commands: [
    { name: 'Flow Command', flowID: '1', isActive: false },
    { name: 'Contextualized Help', flowID: '2', isActive: true },
  ],
});

export const alexa = () => <StartBlock platform={PLATFORMS[0]} invocationName="Headspace" {...getHomeProps()} />;

export const google = () => <StartBlock platform={PLATFORMS[1]} invocationName="Headspace" {...getHomeProps()} />;

export const flowStartBlock = () => <StartBlock platform={PLATFORMS[0]} invocationName="Headspace" inFlow={true} flowName="Flow Name" />;

export const flowWithCommands = () => <StartBlock inFlow={true} flowName="Flow Name" {...getFlowProps()} />;
