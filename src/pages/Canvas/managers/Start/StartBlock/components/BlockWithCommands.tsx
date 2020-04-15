import React from 'react';

import Block, { BlockAPI, BlockProps } from '@/pages/Canvas/components/Block';
import { useStepAPI } from '@/pages/Canvas/components/Node/hooks';
import { StepAPIProvider } from '@/pages/Canvas/components/Step/contexts';

import { BaseStartBlockProps } from '../types';

export type BlockWithCommandsProps = BaseStartBlockProps & Pick<BlockProps, 'name' | 'state' | 'icon' | 'lockOwner'>;

const BlockWithCommands: React.RefForwardingComponent<{ api: BlockAPI }, React.PropsWithChildren<BlockWithCommandsProps>> = (
  { commands, children, ...props },
  ref
) => {
  const stepRef = React.useRef<HTMLDivElement>(null);
  const sections = commands ? [{ name: 'Commands', children: commands }] : [];
  const stepAPI = useStepAPI(true, true, false, stepRef);

  return (
    <StepAPIProvider value={stepAPI}>
      <Block {...props} sections={sections} ref={ref}>
        {children}
      </Block>
    </StepAPIProvider>
  );
};

export default React.forwardRef(BlockWithCommands);
