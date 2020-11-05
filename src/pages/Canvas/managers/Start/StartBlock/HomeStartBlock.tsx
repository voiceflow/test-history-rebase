import React from 'react';

import { HOME_BLOCK_CLASSNAME } from '@/pages/Canvas/constants';
import { BlockAPI } from '@/pages/Canvas/types';

import BlockWithCommands, { BlockWithCommandsProps } from './components/BlockWithCommands';

export type HomeStartBlockProps = Omit<BlockWithCommandsProps, 'name' | 'icon'> & {
  invocation: React.ReactNode;
};

const HomeStartBlock: React.ForwardRefRenderFunction<BlockAPI, HomeStartBlockProps> = ({ invocation, children, ...props }, ref) => (
  <BlockWithCommands name="Start" icon="home" commands={children} {...props} className={HOME_BLOCK_CLASSNAME} ref={ref}>
    {invocation}
  </BlockWithCommands>
);

export default React.forwardRef(HomeStartBlock);
