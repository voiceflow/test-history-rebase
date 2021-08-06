import { ProjectLinkType } from '@voiceflow/api-sdk';
import { Portal, stopPropagation, SvgIcon } from '@voiceflow/ui';
import React from 'react';
import { Manager, Popper, Reference } from 'react-popper';

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

  return (
    <Manager>
      <Reference>
        {({ ref }) => (
          <Button ref={ref} isActive={isOpen} onClick={onToggle} tooltipTitle="Line type">
            <SvgIcon icon={isStraightLink ? 'lineStraight' : 'lineCurved'} />
          </Button>
        )}
      </Reference>

      {isOpen && (
        <Portal portalNode={document.body}>
          <Popper placement="bottom" modifiers={{ offset: { offset: '0,5' }, preventOverflow: { boundariesElement: document.body } }} positionFixed>
            {({ ref, style }) => (
              <div ref={ref} style={style}>
                <Content onClick={stopPropagation(null, true)}>
                  <Button onClick={() => onChange(ProjectLinkType.STRAIGHT)} isActive={isStraightLink} isSimple>
                    <SvgIcon icon="lineStraight" />
                  </Button>

                  <Button onClick={() => onChange(ProjectLinkType.CURVED)} isActive={!isStraightLink} isSimple>
                    <SvgIcon icon="lineCurved" />
                  </Button>
                </Content>
              </div>
            )}
          </Popper>
        </Portal>
      )}
    </Manager>
  );
};

export default SettingsType;
