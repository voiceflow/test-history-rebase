import { Icon } from '@voiceflow/ui';
import cn from 'classnames';
import React from 'react';

import * as Router from '@/ducks/router';
import { useDispatch } from '@/hooks';
import { EngineContext } from '@/pages/Canvas/contexts';
import { BlockAPI } from '@/pages/Canvas/types';
import { ClassName } from '@/styles/constants';

import { Container, Section } from './components';
import { BlockSectionProps } from './components/BlockSection';
import { useBlockAPI } from './hooks';

export * from './constants';

export type BlockProps = BlockSectionProps & {
  sections?: {
    name: string;
    icon?: Icon;
    children?: React.ReactNode;
  }[];
  actions?: JSX.Element;
  blockColor?: string;
  nodeID: string;
  isDisabled?: boolean;
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
  { sections = [], children, palette, onMouseEnter, onMouseLeave, onMouseMove, onMouseDown, onClick, isDisabled, nodeID, className, ...props },
  ref
) => {
  const blockAPI = useBlockAPI();
  const engine = React.useContext(EngineContext)!;
  const goToCurrentCanvas = useDispatch(Router.goToCurrentCanvas);

  React.useImperativeHandle(ref, () => blockAPI, [blockAPI]);

  return (
    <Container
      className={cn(ClassName.CANVAS_BLOCK, className)}
      palette={palette}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseDown={onMouseDown}
      onClick={(arg) => {
        if (engine.prototype.isActive) {
          goToCurrentCanvas();
        }

        onClick?.(arg);
      }}
      ref={blockAPI.ref}
    >
      <Section nodeID={nodeID} palette={palette} isDisabled={isDisabled} titleRef={blockAPI.titleRef} {...props}>
        {children}
      </Section>
      {sections.map((section, index) => (
        <Section nodeID={nodeID} palette={palette} isDisabled={isDisabled} {...section} key={index} />
      ))}
    </Container>
  );
};

export default React.forwardRef(Block);
