import composeRef from '@seznam/compose-react-refs';
import { SvgIcon, Text, useOnClickOutside, usePopper, useToggle } from '@voiceflow/ui';
import React from 'react';

import { TopStepItem } from '../../constants';
import SubMenu from '../SubMenu';
import { TopLevelButtonContainer } from './TopLevelButtonContainer';

interface TopLevelButtonItem {
  step: TopStepItem;
}

const TopLevelButton: React.FC<TopLevelButtonItem> = ({ step }) => {
  const [isSubMenuOpen, toggleIsSubMenuOpen] = useToggle(false);

  const popper = usePopper({
    placement: 'right',
    strategy: 'fixed',
    modifiers: [
      { name: 'offset', options: { offset: [0, 5] } },
      { name: 'preventOverflow', options: { boundary: document.body } },
    ],
  });
  const subMenuRef = React.useRef<HTMLDivElement>(null);
  const topLevelRef = React.useRef<HTMLDivElement>(null);

  useOnClickOutside(subMenuRef, () => toggleIsSubMenuOpen(false), [isSubMenuOpen]);

  return (
    <>
      <TopLevelButtonContainer
        onClick={toggleIsSubMenuOpen}
        focused={isSubMenuOpen}
        ref={composeRef<HTMLDivElement>(popper.setReferenceElement, topLevelRef)}
      >
        <SvgIcon icon={step.icon} size={22}></SvgIcon>
        <Text paddingTop="4px" fontSize="11px">
          {step.name}
        </Text>
      </TopLevelButtonContainer>
      {step.childSteps && isSubMenuOpen && <SubMenu steps={step.childSteps} subMenuRef={subMenuRef} />}
    </>
  );
};

export default TopLevelButton;
