import React from 'react';

import NewBlock, { NewBlockAPI, NewBlockProps } from '@/pages/Canvas/components/Block/NewBlock';

import { BaseStartBlockProps } from '../types';

export type BlockWithCommandsProps = BaseStartBlockProps & Pick<NewBlockProps, 'name' | 'icon'>;

const BlockWithCommands: React.RefForwardingComponent<{ api: NewBlockAPI }, React.PropsWithChildren<BlockWithCommandsProps>> = (
  { commands, children, ...props },
  ref
) => {
  const sections = commands ? [{ name: 'Commands', children: commands }] : [];

  return (
    <NewBlock {...props} sections={sections} ref={ref}>
      {children}
    </NewBlock>
  );
};

export default React.forwardRef(BlockWithCommands);
