import React from 'react';

import { Icon } from '@/components/SvgIcon';
import { BlockState, BlockVariant } from '@/constants/canvas';

import { Container, Section } from './components';
import { NewBlockHeaderProps } from './components/NewBlockHeader';

export * from './types';

export type NewBlockProps = WithOptional<NewBlockHeaderProps, 'state' | 'variant'> & {
  sections?: {
    name: string;
    icon?: Icon;
    children?: React.ReactNode;
  }[];
  isActive?: boolean;
  updateName?: (name: string) => void;
};

export type NodeBlockAPI = {
  getBoundingClientRect: () => DOMRect;
  rename: () => void;
};

const NewBlock: React.RefForwardingComponent<{ api: NodeBlockAPI }, React.PropsWithChildren<NewBlockProps>> = (
  { state = BlockState.REGULAR, variant = BlockVariant.STANDARD, sections = [], children, ...props },
  ref
) => {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const titleRef = React.useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = React.useState(false);

  React.useImperativeHandle(
    ref,
    () => ({
      api: {
        getBoundingClientRect: () => rootRef.current!.getBoundingClientRect(),
        rename: () => {
          setIsEditing(true);
          titleRef.current?.focus();
        },
      },
    }),
    []
  );

  return (
    <Container variant={variant} state={state} ref={rootRef}>
      <Section variant={variant} state={state} isEditing={isEditing} setIsEditing={setIsEditing} titleRef={titleRef} {...props}>
        {children}
      </Section>
      {sections.map((section, index) => (
        <Section variant={variant} state={state} {...section} key={index} />
      ))}
    </Container>
  );
};

export default React.forwardRef(NewBlock);
