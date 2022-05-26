import React from 'react';

import { HOME_BLOCK_CLASSNAME } from '@/pages/Canvas/constants';
import { BlockAPI } from '@/pages/Canvas/types';

import BlockWithCommands, { BlockWithCommandsProps } from './components/BlockWithCommands';
import HomeStartStep, { HomeStartStepProps } from './components/HomeStartStep';

export type HomeStartBlockProps = Omit<BlockWithCommandsProps, 'icon'> & HomeStartStepProps;

const HomeStartBlock: React.ForwardRefRenderFunction<BlockAPI, HomeStartBlockProps> = (
  { name, label, portID, platform, invocationName, children, commands, palette, ...props },
  ref
) => (
  <BlockWithCommands name={name || 'Start'} commands={commands || children} {...props} className={HOME_BLOCK_CLASSNAME} ref={ref} palette={palette}>
    <HomeStartStep label={label} platform={platform} invocationName={invocationName} portID={portID} palette={palette} />
  </BlockWithCommands>
);

export default React.forwardRef(HomeStartBlock);
