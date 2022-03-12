import composeRef from '@seznam/compose-react-refs';
import { swallowEvent } from '@voiceflow/ui';
import React from 'react';

import OverflowTippyTooltip from '@/components/OverflowTippyTooltip';
import { slotStyles, variableStyle, VariableTagTooltipStyles } from '@/components/VariableTag';
import { FeatureFlag } from '@/config/features';
import { InteractionModelTabType, ModalType } from '@/constants';
import * as Router from '@/ducks/router';
import { compose, styled } from '@/hocs';
import { useDispatch, useFeature, useModals } from '@/hooks';

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

const Slot = ({ children, mention }, ref) => {
  const IMM_MODALS_V2 = useFeature(FeatureFlag.IMM_MODALS_V2);
  const { open: openEntityEditModal } = useModals(ModalType.ENTITY_EDIT);

  const goInteractionModelEntity = useDispatch(Router.goToCurrentCanvasInteractionModelEntity);

  const onClickHandler = swallowEvent(() => {
    if (IMM_MODALS_V2.isEnabled) {
      openEntityEditModal({ id: mention.id });
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
          <Text
            ref={composeRef(ref, overflowRef)}
            color={mention.color}
            onClick={onClickHandler}
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
};

export default compose(React.forwardRef)(Slot);
