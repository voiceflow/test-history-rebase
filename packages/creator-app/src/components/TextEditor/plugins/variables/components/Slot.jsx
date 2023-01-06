import composeRef from '@seznam/compose-react-refs';
import { compose, OverflowTippyTooltip, swallowEvent } from '@voiceflow/ui';
import React from 'react';

import { VariableTagTooltipStyles } from '@/components/VariableTag';
import { InteractionModelTabType, ModalType } from '@/constants';
import * as Router from '@/ducks/router';
import * as SlotV2 from '@/ducks/slotV2';
import { useModals } from '@/hooks/modals';
import { useDispatch } from '@/hooks/realtime';
import { useSelector } from '@/hooks/redux';

import { StyledTag } from './StyledTag';

const Slot = ({ mention, children }, ref) => {
  const { open: openEntityEditModal } = useModals(ModalType.ENTITY_EDIT);
  const getSlotByName = useSelector(SlotV2.slotByNameSelector);
  const getSlotByID = useSelector(SlotV2.getSlotByIDSelector);

  const goToInteractionModelEntity = useDispatch(Router.goToCurrentCanvasInteractionModelEntity);

  const onClickHandler = (event) => {
    if (!mention.id) return;

    swallowEvent(null, true)(event);

    const slotID = getSlotByName(mention.name)?.id || mention.id;

    if (getSlotByID({ id: slotID })) {
      openEntityEditModal({ id: slotID });
    } else {
      goToInteractionModelEntity(InteractionModelTabType.VARIABLES, mention.id);
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
