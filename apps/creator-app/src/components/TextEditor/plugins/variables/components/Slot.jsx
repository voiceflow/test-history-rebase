import composeRef from '@seznam/compose-react-refs';
import { compose, OverflowTippyTooltip, swallowEvent } from '@voiceflow/ui';
import React from 'react';

import { VariableTagTooltipStyles } from '@/components/VariableTag';
import { InteractionModelTabType } from '@/constants';
import * as Router from '@/ducks/router';
import { useEntityMapByNameSelector, useGetOneEntityByIDSelector, useOnOpenEntityEditModal } from '@/hooks/entity.hook';
import { useDispatch } from '@/hooks/realtime';

import { StyledTag } from './StyledTag';

const Slot = ({ mention, children }, ref) => {
  const getSlotByID = useGetOneEntityByIDSelector();
  const slotNameMap = useEntityMapByNameSelector();

  const goToNLUQuickViewEntity = useDispatch(Router.goToNLUQuickViewEntity);
  const onOpenEntityEditModal = useOnOpenEntityEditModal();

  const onClickHandler = (event) => {
    if (!mention.id) return;

    swallowEvent(null, true)(event);

    const entityID = slotNameMap[mention.name]?.id || mention.id;

    if (getSlotByID({ id: entityID })) {
      onOpenEntityEditModal({ entityID });
    } else {
      goToNLUQuickViewEntity(InteractionModelTabType.VARIABLES, mention.id);
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
