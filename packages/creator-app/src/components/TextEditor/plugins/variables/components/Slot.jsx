import composeRef from '@seznam/compose-react-refs';
import { swallowEvent, Tag } from '@voiceflow/ui';
import React from 'react';

import OverflowTippyTooltip from '@/components/OverflowTippyTooltip';
import { VariableTagTooltipStyles } from '@/components/VariableTag';
import { FeatureFlag } from '@/config/features';
import { InteractionModelTabType, ModalType } from '@/constants';
import * as Router from '@/ducks/router';
import * as SlotV2 from '@/ducks/slotV2';
import { compose, styled } from '@/hocs';
import { useDispatch, useFeature, useModals, useSelector } from '@/hooks';

const StyledTag = styled(Tag)`
  pointer-events: none;
  display: inline-flex;
  max-width: 100%;
  position: relative;
  top: -1px;

  > span {
    pointer-events: all;

    word-break: normal;
    cursor: pointer;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;

    &:before :after {
      content: '';
      display: none;
    }
  }
`;

const Slot = ({ mention, children }, ref) => {
  const IMM_MODALS_V2 = useFeature(FeatureFlag.IMM_MODALS_V2);
  const { open: openEntityEditModal } = useModals(ModalType.ENTITY_EDIT);
  const getSlotByName = useSelector(SlotV2.slotByNameSelector);

  const goInteractionModelEntity = useDispatch(Router.goToCurrentCanvasInteractionModelEntity);

  const onClickHandler = swallowEvent(() => {
    if (IMM_MODALS_V2.isEnabled) {
      if (mention.id && !mention.isVariable) {
        const slotID = getSlotByName(mention.name)?.id || mention.id;
        openEntityEditModal({ id: slotID });
      }
    } else {
      goInteractionModelEntity(mention.isVariable ? InteractionModelTabType.VARIABLES : InteractionModelTabType.SLOTS, mention.id);
    }
  }, true);

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
            onClick={onClickHandler}
            onMouseUp={swallowEvent(null, true)}
            onMouseDown={swallowEvent(null, true)}
            isVariable={mention.isVariable}
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
