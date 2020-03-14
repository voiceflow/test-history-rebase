import React from 'react';

import { NewBlockAPI } from '@/pages/Canvas/components/Block/NewBlock';

import BlockWithCommands, { BlockWithCommandsProps } from './components/BlockWithCommands';
import FlowStartStep, { FlowStartStepProps } from './components/FlowStartStep';

export type FlowStartBlockProps = BlockWithCommandsProps & FlowStartStepProps;

const FlowStartBlock: React.RefForwardingComponent<{ api: NewBlockAPI }, FlowStartBlockProps> = ({ portID, children, ...props }, ref) => (
  <BlockWithCommands {...props} commands={children} ref={ref}>
    <FlowStartStep portID={portID} />
  </BlockWithCommands>
);

export default React.forwardRef(FlowStartBlock);
