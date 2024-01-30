import composeRef from '@seznam/compose-react-refs';
import { FeatureFlag } from '@voiceflow/realtime-sdk';
import { compose, OverflowTippyTooltip, swallowEvent } from '@voiceflow/ui';
import React from 'react';

import { VariableTagTooltipStyles } from '@/components/VariableTag';
import { InteractionModelTabType } from '@/constants';
import * as Router from '@/ducks/router';
import { useFeature } from '@/hooks/feature';
import { useEntityEditModal, useVariableEditModal } from '@/hooks/modal.hook';
import { useDispatch } from '@/hooks/realtime';

import { StyledTag } from './StyledTag';

const Slot = ({ mention, children }, ref) => {
  const cmsVariables = useFeature(FeatureFlag.CMS_VARIABLES);
  const entityEditModal = useEntityEditModal();
  const variableEditModal = useVariableEditModal();
  const goToNLUQuickViewEntity = useDispatch(Router.goToNLUQuickViewEntity);

  const onClickHandler = (event) => {
    if (!mention.id) return;

    swallowEvent(null, true)(event);

    if (!mention.isVariable) {
      entityEditModal.openVoid({ entityID: mention.id });
    } else if (cmsVariables.isEnabled) {
      variableEditModal.openVoid({ variableID: mention.id });
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
