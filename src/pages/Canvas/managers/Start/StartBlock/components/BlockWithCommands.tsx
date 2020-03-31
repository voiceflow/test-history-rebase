import React from 'react';

import NewBlock, { NewBlockAPI, NewBlockProps } from '@/pages/Canvas/components/Block/NewBlock';
import { useStepAPI } from '@/pages/Canvas/components/Node/hooks';
import { StepAPIProvider } from '@/pages/Canvas/components/Step/contexts';

import { BaseStartBlockProps } from '../types';

export type BlockWithCommandsProps = BaseStartBlockProps & Pick<NewBlockProps, 'name' | 'state' | 'icon' | 'lockOwner'>;

const BlockWithCommands: React.RefForwardingComponent<{ api: NewBlockAPI }, React.PropsWithChildren<BlockWithCommandsProps>> = (
  { commands, children, ...props },
  ref
) => {
  const stepRef = React.useRef<HTMLDivElement>(null);
  const sections = commands ? [{ name: 'Commands', children: commands }] : [];
  const stepAPI = useStepAPI(true, true, false, stepRef);

  return (
    <StepAPIProvider value={stepAPI}>
      <NewBlock {...props} sections={sections} ref={ref}>
        {children}
      </NewBlock>
    </StepAPIProvider>
  );
};

export default React.forwardRef(BlockWithCommands);
