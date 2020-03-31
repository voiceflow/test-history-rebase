import React from 'react';

import { Icon } from '@/components/SvgIcon';
import User from '@/components/User';
import { BlockState, BlockVariant } from '@/constants/canvas';
import { LockOwnerType } from '@/models';

import { Container, Section } from './components';
import { NewBlockHeaderProps } from './components/NewBlockHeader';

export * from './types';
export * from './constants';

// TODO: remove this once User component is converted into TS
// declaring the type for component otherwise, TS implies its of RefAttribute
// and gives error that user prop does not exist on the component
const LockOwner: any = User;

export type NewBlockProps = WithOptional<NewBlockHeaderProps, 'state' | 'variant'> & {
  sections?: {
    name: string;
    icon?: Icon;
    children?: React.ReactNode;
  }[];
  lockOwner?: LockOwnerType | unknown;
  hasLinkWarning?: boolean;
  blockColor?: string;
  showMergeOverlay?: boolean;
  updateName?: (name: string) => void;
  updateBlockColor?: (color: string) => void;
  onMouseEnter?: (event: React.MouseEvent) => void;
  onMouseLeave?: (event: React.MouseEvent) => void;
};

export type NewBlockAPI<T extends HTMLElement = HTMLElement> = {
  ref: React.RefObject<T>;
  getBoundingClientRect: () => DOMRect;
  rename: () => void;
  updateBlockColor: (color: string) => void;
};

const NewBlock: React.RefForwardingComponent<{ api: NewBlockAPI }, React.PropsWithChildren<NewBlockProps>> = (
  {
    state = BlockState.REGULAR,
    variant = BlockVariant.STANDARD,
    sections = [],
    lockOwner,
    children,
    blockColor,
    updateBlockColor,
    onMouseEnter,
    onMouseLeave,
    hasLinkWarning,
    ...props
  },
  ref
) => {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const titleRef = React.useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = React.useState(false);

  React.useImperativeHandle(
    ref,
    () => ({
      api: {
        ref: rootRef,
        getBoundingClientRect: () => rootRef.current!.getBoundingClientRect(),
        rename: () => {
          setIsEditing(true);
          titleRef.current?.focus();
        },
        updateBlockColor: (color: string) => {
          updateBlockColor?.(color);
        },
      },
    }),
    []
  );

  return (
    <Container variant={variant} state={state} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} ref={rootRef} hasLinkWarning={hasLinkWarning}>
      {lockOwner && <LockOwner user={lockOwner} />}
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
