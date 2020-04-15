import React from 'react';

import { BlockAPI } from '@/pages/Canvas/components/Block';

import BlockWithCommands, { BlockWithCommandsProps } from './components/BlockWithCommands';
import FlowStartStep, { FlowStartStepProps } from './components/FlowStartStep';

export type FlowStartBlockProps = BlockWithCommandsProps & FlowStartStepProps;

const FlowStartBlock: React.RefForwardingComponent<{ api: BlockAPI }, FlowStartBlockProps> = ({ portID, commands, ...props }, ref) => (
  <BlockWithCommands {...props} commands={commands} ref={ref}>
    <FlowStartStep portID={portID} />
  </BlockWithCommands>
);

export default React.forwardRef(FlowStartBlock);
