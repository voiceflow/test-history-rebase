import React from 'react';

import { BlockAPI } from '@/pages/Canvas/components/Block';

import BlockWithCommands, { BlockWithCommandsProps } from './components/BlockWithCommands';
import HomeStartStep, { HomeStartStepProps } from './components/HomeStartStep';

export type HomeStartBlockProps = Omit<BlockWithCommandsProps, 'name' | 'icon'> & HomeStartStepProps;

const HomeStartBlock: React.RefForwardingComponent<{ api: BlockAPI }, HomeStartBlockProps> = (
  { portID, platform, invocationName, children, ...props },
  ref
) => (
  <BlockWithCommands name="Home" icon="home" commands={children} {...props} ref={ref}>
    <HomeStartStep platform={platform} invocationName={invocationName} portID={portID} />
  </BlockWithCommands>
);

export default React.forwardRef(HomeStartBlock);
