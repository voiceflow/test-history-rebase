import composeRef from '@seznam/compose-react-refs';
import { swallowEvent } from '@voiceflow/ui';
import React from 'react';

import OverflowTippyTooltip from '@/components/OverflowTippyTooltip';
import { slotStyles, variableStyle, VariableTagTooltipStyles } from '@/components/VariableTag';
import { InteractionModelTabType } from '@/constants';
import * as Router from '@/ducks/router';
import { compose, connect, styled } from '@/hocs';

const Text = styled.span`
  pointer-events: none;
  display: inline-flex;
  max-width: 100%;

  > span {
    pointer-events: all;
    ${({ isVariable }) => (isVariable ? variableStyle : slotStyles)}

    word-break: normal;
    line-height: 18px;
    cursor: pointer;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &:before :after {
      content: '';
      display: none;
    }
  }
`;

const Slot = ({ children, mention, goInteractionModelEntity }, ref) => (
  <OverflowTippyTooltip
    delay={300}
    title={mention.name}
    isChildrenOverflow={(node) => node.firstElementChild?.scrollWidth > node.firstElementChild?.clientWidth}
  >
    {(overflowRef, { isOverflow }) => (
      <>
        <Text
          ref={composeRef(ref, overflowRef)}
          color={mention.color}
          onClick={swallowEvent(
            () => goInteractionModelEntity(mention.isVariable ? InteractionModelTabType.VARIABLES : InteractionModelTabType.SLOTS, mention.id),
            true
          )}
          onMouseUp={swallowEvent(null, true)}
          onMouseDown={swallowEvent(null, true)}
          isVariable={mention.isVariable}
        >
          {children}
        </Text>

        {isOverflow && <VariableTagTooltipStyles />}
      </>
    )}
  </OverflowTippyTooltip>
);

const mapDispatchToProps = {
  goInteractionModelEntity: Router.goToCurrentCanvasInteractionModelEntity,
};

export default compose(connect(null, mapDispatchToProps, null, { forwardRef: true }), React.forwardRef)(Slot);
