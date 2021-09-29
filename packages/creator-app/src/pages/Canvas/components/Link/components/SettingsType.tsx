import { ProjectLinkType } from '@voiceflow/api-sdk';
import { Portal, stopPropagation, SvgIcon, usePopper } from '@voiceflow/ui';
import React from 'react';

import Button from './SettingsButton';
import Content from './SettingsContent';

interface SettingsTypeProps {
  type: ProjectLinkType;
  isOpen: boolean;
  onToggle: () => void;
  onChange: (type: ProjectLinkType) => void;
}

const SettingsType: React.FC<SettingsTypeProps> = ({ type, isOpen, onToggle, onChange }) => {
  const isStraightLink = type === ProjectLinkType.STRAIGHT;

  const popper = usePopper({
    placement: 'bottom',
    modifiers: [
      { name: 'offset', options: { offset: [0, 5] } },
      { name: 'preventOverflow', options: { boundary: document.body } },
    ],
    strategy: 'fixed',
  });

  return (
    <>
      <Button ref={popper.setReferenceElement} isActive={isOpen} onClick={onToggle} tooltipTitle="Line type">
        <SvgIcon icon={isStraightLink ? 'lineStraight' : 'lineCurved'} />
      </Button>

      {isOpen && (
        <Portal portalNode={document.body}>
          <div ref={popper.setPopperElement} style={popper.styles.popper} {...popper.attributes.popper}>
            <Content onClick={stopPropagation(null, true)}>
              <Button onClick={() => onChange(ProjectLinkType.STRAIGHT)} isActive={isStraightLink} isSimple>
                <SvgIcon icon="lineStraight" />
              </Button>

              <Button onClick={() => onChange(ProjectLinkType.CURVED)} isActive={!isStraightLink} isSimple>
                <SvgIcon icon="lineCurved" />
              </Button>
            </Content>
          </div>
        </Portal>
      )}
    </>
  );
};

export default SettingsType;
