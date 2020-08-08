import cn from 'classnames';
import React from 'react';

import { Icon } from '@/components/SvgIcon';
import User from '@/components/User';
import { BlockVariant } from '@/constants/canvas';
import { LockOwner } from '@/models';
import { BlockAPI } from '@/pages/Canvas/types';
import { ClassName } from '@/styles/constants';

import { Container, Section } from './components';
import { BlockSectionProps } from './components/BlockSection';
import { useBlockAPI } from './hooks';

export * from './types';
export * from './constants';

export type BlockProps = WithOptional<BlockSectionProps, 'variant'> & {
  sections?: {
    name: string;
    icon?: Icon;
    children?: React.ReactNode;
  }[];
  lockOwner?: LockOwner | null;
  blockColor?: string;
  isDisabled?: boolean;
  isLocked?: boolean;
  showMergeOverlay?: boolean;
  updateName?: (name: string) => void;
  onMouseMove?: (event: React.MouseEvent) => void;
  onMouseEnter?: (event: React.MouseEvent) => void;
  onMouseLeave?: (event: React.MouseEvent) => void;
  onMouseDown?: (event: React.MouseEvent) => void;
  onClick?: (event: React.MouseEvent) => void;
  className?: string;
};

const Block: React.ForwardRefRenderFunction<BlockAPI, React.PropsWithChildren<BlockProps>> = (
  {
    variant = BlockVariant.STANDARD,
    sections = [],
    lockOwner,
    children,
    blockColor,
    onMouseEnter,
    onMouseLeave,
    onMouseMove,
    onMouseDown,
    onClick,
    isDisabled,
    isLocked,
    className,
    ...props
  },
  ref
) => {
  const blockAPI = useBlockAPI();

  React.useImperativeHandle(ref, () => blockAPI, [blockAPI]);

  return (
    <Container
      className={cn(ClassName.CANVAS_BLOCK, className)}
      variant={variant}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseDown={onMouseDown}
      onClick={onClick}
      ref={blockAPI.ref}
    >
      {lockOwner && <User user={lockOwner} />}
      <Section
        variant={variant}
        isDisabled={isDisabled}
        isLocked={isLocked}
        isEditing={blockAPI.isEditing}
        setIsEditing={blockAPI.setIsEditing}
        titleRef={blockAPI.titleRef}
        {...props}
      >
        {children}
      </Section>
      {sections.map((section, index) => (
        <Section variant={variant} isDisabled={isDisabled} {...section} key={index} />
      ))}
    </Container>
  );
};

export default React.forwardRef(Block);
