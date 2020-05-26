import React from 'react';

import { HOME_BLOCK_CLASSNAME } from '@/pages/Canvas/constants';
import { BlockAPI } from '@/pages/Canvas/types';

import BlockWithCommands, { BlockWithCommandsProps } from './components/BlockWithCommands';
import HomeStartStep, { HomeStartStepProps } from './components/HomeStartStep';

export type HomeStartBlockProps = Omit<BlockWithCommandsProps, 'name' | 'icon'> & HomeStartStepProps;

const HomeStartBlock: React.RefForwardingComponent<BlockAPI, HomeStartBlockProps> = (
  { portID, platform, invocationName, children, ...props },
  ref
) => (
  <BlockWithCommands name="Home" icon="home" commands={children} {...props} className={HOME_BLOCK_CLASSNAME} ref={ref}>
    <HomeStartStep platform={platform} invocationName={invocationName} portID={portID} />
  </BlockWithCommands>
);

export default React.forwardRef(HomeStartBlock);
