import React from 'react';

import { NewBlockAPI } from '@/pages/Canvas/components/Block/NewBlock';

import BlockWithCommands, { BlockWithCommandsProps } from './components/BlockWithCommands';
import HomeStartStep, { HomeStartStepProps } from './components/HomeStartStep';

export type HomeStartBlockProps = Omit<BlockWithCommandsProps, 'name' | 'icon'> & HomeStartStepProps;

const HomeStartBlock: React.RefForwardingComponent<{ api: NewBlockAPI }, HomeStartBlockProps> = (
  { portID, platform, invocationName, children, ...props },
  ref
) => (
  <BlockWithCommands name="Home" icon="home" commands={children} {...props} ref={ref}>
    <HomeStartStep platform={platform} invocationName={invocationName} portID={portID} />
  </BlockWithCommands>
);

export default React.forwardRef(HomeStartBlock);
