import React from 'react';

import { slotStyles, variableStyle } from '@/components/VariableTag';
import { InteractionModelTabType } from '@/constants';
import * as Router from '@/ducks/router';
import { connect, styled } from '@/hocs';
import { swallowEvent } from '@/utils/dom';
import { compose } from '@/utils/functional';

const Text = styled.span`
  pointer-events: none;

  > span {
    pointer-events: all;
    ${({ isVariable }) => (isVariable ? variableStyle : slotStyles)}

    word-break: normal;
    border: none;
    line-height: 18px;
    box-shadow: ${({ isVariable }) => (isVariable ? 'inset 0 0 0 1px #dfe5ea' : 'none')};
    cursor: pointer;

    &:before,
    &:after {
      content: '';
      display: none;
    }
  }
`;

const Slot = ({ children, mention, goInteractionModelEntity }, ref) => {
  return (
    <Text
      ref={ref}
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
  );
};

const mapDispatchToProps = {
  goInteractionModelEntity: Router.goToCurrentCanvasInteractionModelEntity,
};

export default compose(connect(null, mapDispatchToProps, null, { forwardRef: true }), React.forwardRef)(Slot);
