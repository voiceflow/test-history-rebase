import React from 'react';

import { FLOW_BLOCK_CLASSNAME } from '@/pages/Canvas/constants';
import { BlockAPI } from '@/pages/Canvas/types';

import BlockWithCommands, { BlockWithCommandsProps } from './components/BlockWithCommands';
import FlowStartStep, { FlowStartStepProps } from './components/FlowStartStep';

export type FlowStartBlockProps = BlockWithCommandsProps & FlowStartStepProps;

const FlowStartBlock: React.ForwardRefRenderFunction<BlockAPI, FlowStartBlockProps> = ({ label, portID, commands, palette, ...props }, ref) => (
  <BlockWithCommands {...props} className={FLOW_BLOCK_CLASSNAME} commands={commands} ref={ref} palette={palette}>
    <FlowStartStep label={label} portID={portID} palette={palette} />
  </BlockWithCommands>
);

export default React.forwardRef(FlowStartBlock);
