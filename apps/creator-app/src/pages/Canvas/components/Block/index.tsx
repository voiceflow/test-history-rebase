import { SvgIconTypes } from '@voiceflow/ui';
import cn from 'classnames';
import React from 'react';

import { CombinedAPI } from '@/pages/Canvas/types';
import { ClassName } from '@/styles/constants';

import { Container, Section } from './components';
import { BlockSectionProps } from './components/BlockSection';
import { useBlockAPI } from './hooks';

export * from './constants';

export interface BlockSection {
  name: string;
  icon?: SvgIconTypes.Icon;
  children?: React.ReactNode;
}

export interface BlockProps extends BlockSectionProps {
  nodeID: string;
  actions?: JSX.Element;
  onClick?: React.MouseEventHandler<HTMLElement>;
  sections?: BlockSection[];
  className?: string;
  isDisabled?: boolean;
  onMouseMove?: React.MouseEventHandler<HTMLElement>;
  onMouseDown?: React.MouseEventHandler<HTMLElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLElement>;
  showMergeOverlay?: boolean;
}

const Block = React.forwardRef<CombinedAPI, React.PropsWithChildren<BlockProps>>(
  (
    { nodeID, palette, onClick, sections = [], children, className, isDisabled, onMouseMove, onMouseDown, onMouseEnter, onMouseLeave, ...props },
    ref
  ) => {
    const blockAPI = useBlockAPI();

    React.useImperativeHandle(ref, () => blockAPI, [blockAPI]);

    return (
      <Container
        ref={blockAPI.ref}
        palette={palette}
        onClick={onClick}
        className={cn(ClassName.CANVAS_BLOCK, className)}
        onMouseMove={onMouseMove}
        onMouseDown={onMouseDown}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <Section palette={palette} isDisabled={isDisabled} titleRef={blockAPI.titleRef} {...props}>
          {children}
        </Section>

        {sections.map((section, index) => (
          <Section palette={palette} isDisabled={isDisabled} {...section} key={index} />
        ))}
      </Container>
    );
  }
);

export default Block;
