import React from 'react';

import FlowStartBlock, { FlowStartBlockProps } from './FlowStartBlock';
import HomeStartBlock from './HomeStartBlock';
import { BaseStartBlockProps } from './types';

export type StartBlockProps = (BaseStartBlockProps & { inFlow?: false }) | (FlowStartBlockProps & { inFlow: true });

const StartBlock: React.FC<StartBlockProps> = ({ inFlow = false, ...props }) => {
  return inFlow ? <FlowStartBlock {...(props as FlowStartBlockProps)} /> : <HomeStartBlock {...props} />;
};

export default StartBlock;
