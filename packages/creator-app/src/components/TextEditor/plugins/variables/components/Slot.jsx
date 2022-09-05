import composeRef from '@seznam/compose-react-refs';
import { OverflowTippyTooltip, swallowEvent } from '@voiceflow/ui';
import React from 'react';

import { VariableTagTooltipStyles } from '@/components/VariableTag';
import { ModalType } from '@/constants';
import * as SlotV2 from '@/ducks/slotV2';
import { compose } from '@/hocs';
import { useModals, useSelector } from '@/hooks';

import { StyledTag } from './StyledTag';

const Slot = ({ mention, children }, ref) => {
  const { open: openEntityEditModal } = useModals(ModalType.ENTITY_EDIT);
  const getSlotByName = useSelector(SlotV2.slotByNameSelector);

  const onClickHandler = () => {
    if (mention.id && !mention.isVariable) {
      const slotID = getSlotByName(mention.name)?.id || mention.id;
      openEntityEditModal({ id: slotID });
    }
  };

  return (
    <OverflowTippyTooltip
      delay={300}
      title={mention.name}
      isChildrenOverflow={(node) => node.firstElementChild?.scrollWidth > node.firstElementChild?.clientWidth}
    >
      {(overflowRef, { isOverflow }) => (
        <>
          <StyledTag
            ref={composeRef(ref, overflowRef)}
            color={mention.color}
            onClick={mention.isVariable ? undefined : swallowEvent(onClickHandler, true)}
            onMouseUp={mention.isVariable ? undefined : swallowEvent(null, true)}
            isVariable={mention.isVariable}
            onMouseDown={mention.isVariable ? undefined : swallowEvent(null, true)}
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
