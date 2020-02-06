import React from 'react';
import Toggle from 'react-toggle';

import SvgIcon from '@/components/SvgIcon';
import { styled, transition } from '@/hocs';
import { swallowEvent } from '@/utils/dom';

import { SectionToggleVariant } from '../../constants';

const ToggleArrowContainer = styled.div`
  ${transition('transform')}
  color: #becedc;
  transform: ${({ isCollapsed }) => (isCollapsed ? 'rotate(90deg)' : 'rotate(-90deg)')};
  cursor: pointer;

  :hover {
    color: #8da2b5;
  }
`;

const ToggleSwitchContainer = styled.div`
  position: relative;
  height: 20px;
  margin-top: -2px;
  margin-right: -4px;
  margin-left: -4px;
  transform: scale(0.8);
`;

function CollapseTrigger({ onToggle, isCollapsed, variant }) {
  return (
    <div>
      {variant === SectionToggleVariant.ARROW && (
        <ToggleArrowContainer onClick={onToggle} isCollapsed={isCollapsed}>
          <SvgIcon variant="tertiary" icon="arrowLeft" size={12} />
        </ToggleArrowContainer>
      )}

      {variant === SectionToggleVariant.TOGGLE && (
        <ToggleSwitchContainer>
          <Toggle checked={!isCollapsed} icons={false} onClick={onToggle} onChange={swallowEvent()} />
        </ToggleSwitchContainer>
      )}
    </div>
  );
}

export default CollapseTrigger;
