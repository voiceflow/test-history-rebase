import React from 'react';

import { HOME_BLOCK_CLASSNAME } from '@/pages/Canvas/constants';
import { BlockAPI } from '@/pages/Canvas/types';

import BlockWithCommands, { BlockWithCommandsProps } from './components/BlockWithCommands';
import HomeStartStep, { HomeStartStepProps } from './components/HomeStartStep';

export type HomeStartBlockProps = Omit<BlockWithCommandsProps, 'icon'> & HomeStartStepProps;

const HomeStartBlock: React.ForwardRefRenderFunction<BlockAPI, HomeStartBlockProps> = (
  { name, label, portID, platform, invocationName, children, commands, variant, ...props },
  ref
) => (
  <BlockWithCommands name={name || 'Start'} commands={commands || children} {...props} className={HOME_BLOCK_CLASSNAME} ref={ref} variant={variant}>
    <HomeStartStep label={label} platform={platform} invocationName={invocationName} portID={portID} variant={variant} />
  </BlockWithCommands>
);

export default React.forwardRef(HomeStartBlock);
