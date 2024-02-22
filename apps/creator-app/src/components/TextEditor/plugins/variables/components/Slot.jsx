import composeRef from '@seznam/compose-react-refs';
import { compose, OverflowTippyTooltip, swallowEvent } from '@voiceflow/ui';
import React from 'react';

import { VariableTagTooltipStyles } from '@/components/VariableTag';
import { useEntityEditModal, useVariableEditModal } from '@/hooks/modal.hook';

import { StyledTag } from './StyledTag';

const Slot = ({ mention, children }, ref) => {
  const entityEditModal = useEntityEditModal();
  const variableEditModal = useVariableEditModal();

  const onClickHandler = (event) => {
    if (!mention.id) return;

    swallowEvent(null, true)(event);

    if (!mention.isVariable) {
      entityEditModal.openVoid({ entityID: mention.id });
    } else {
      variableEditModal.openVoid({ variableID: mention.id });
    }
  };

  return (
    <OverflowTippyTooltip
      delay={300}
      content={mention.name}
      isChildrenOverflow={(node) => node.firstElementChild?.scrollWidth > node.firstElementChild?.clientWidth}
    >
      {(overflowRef, { isOverflow }) => (
        <>
          <StyledTag
            ref={composeRef(ref, overflowRef)}
            color={mention.color}
            onClick={onClickHandler}
            onMouseUp={(event) => mention.id && swallowEvent(null, true)(event)}
            isVariable={mention.isVariable}
            onMouseDown={(event) => mention.id && swallowEvent(null, true)(event)}
          >
            {children}
          </StyledTag>

          {isOverflow && <VariableTagTooltipStyles />}
        </>
      )}
    </OverflowTippyTooltip>
  );
};

export default compose(React.forwardRef)(Slot);
