import React from 'react';

import Block, { BlockProps } from '@/pages/Canvas/components/Block';
import { useStepAPI } from '@/pages/Canvas/components/Node/components/NodeStep/hooks';
import { StepAPIProvider } from '@/pages/Canvas/components/Step/contexts';
import { BlockAPI } from '@/pages/Canvas/types';

import { BaseStartBlockProps } from '../types';

export type BlockWithCommandsProps = BaseStartBlockProps &
  Pick<BlockProps, 'name' | 'icon' | 'lockOwner' | 'actions' | 'nodeID'> & {
    className?: string;
  };

const BlockWithCommands: React.ForwardRefRenderFunction<BlockAPI, React.PropsWithChildren<BlockWithCommandsProps>> = (
  { commands, children, ...props },
  ref
) => {
  const stepRef = React.useRef<HTMLDivElement>(null);
  const sections = commands ? [{ name: 'Commands', children: commands }] : [];
  const stepAPI = useStepAPI(stepRef, true, false);

  return (
    <StepAPIProvider value={stepAPI}>
      <Block {...props} sections={sections} ref={ref}>
        {children}
      </Block>
    </StepAPIProvider>
  );
};

export default React.forwardRef(BlockWithCommands);
