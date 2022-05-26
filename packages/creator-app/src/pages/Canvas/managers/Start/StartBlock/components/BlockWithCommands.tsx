import React from 'react';

import Block, { BlockProps } from '@/pages/Canvas/components/Block';
import { useStepAPI } from '@/pages/Canvas/components/Node/components/NodeStep/hooks';
import { StepAPIProvider } from '@/pages/Canvas/components/Step/contexts';
import { EngineContext } from '@/pages/Canvas/contexts';
import { BlockAPI } from '@/pages/Canvas/types';

import { BaseStartBlockProps } from '../types';

export type BlockWithCommandsProps = BaseStartBlockProps &
  Pick<BlockProps, 'name' | 'icon' | 'actions' | 'nodeID' | 'palette'> & {
    className?: string;
  };

const BlockWithCommands: React.ForwardRefRenderFunction<BlockAPI, React.PropsWithChildren<BlockWithCommandsProps>> = (
  { nodeID, commands, children, palette, ...props },
  ref
) => {
  const engine = React.useContext(EngineContext)!;

  const stepRef = React.useRef<HTMLDivElement>(null);
  const sections = commands ? [{ name: 'Commands', children: commands }] : [];
  const stepAPI = useStepAPI(stepRef, true, false, () => stepRef.current?.getBoundingClientRect() ?? null);

  const updateName = React.useCallback((name) => engine.node.updateData(nodeID, { name }), [engine, nodeID]);

  return (
    <StepAPIProvider value={stepAPI}>
      <Block {...props} palette={palette} ref={ref} nodeID={nodeID} sections={sections} updateName={updateName} canEditTitle>
        {children}
      </Block>
    </StepAPIProvider>
  );
};

export default React.forwardRef(BlockWithCommands);
