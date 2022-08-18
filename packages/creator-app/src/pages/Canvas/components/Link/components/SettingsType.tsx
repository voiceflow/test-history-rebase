import { BaseModels } from '@voiceflow/base-types';
import { Portal, stopPropagation, SvgIcon, usePersistFunction, usePopper } from '@voiceflow/ui';
import React from 'react';

import { useCanvasPan, useCanvasZoom } from '@/pages/Canvas/hooks/canvas';

import Button from './SettingsButton';
import Content from './SettingsContent';

interface SettingsTypeProps {
  type: BaseModels.Project.LinkType;
  isOpen: boolean;
  onToggle: () => void;
  onChange: (type: BaseModels.Project.LinkType) => void;
}

const SettingsType: React.FC<SettingsTypeProps> = ({ type, isOpen, onToggle, onChange }) => {
  const isStraightLink = type === BaseModels.Project.LinkType.STRAIGHT;

  const popper = usePopper({
    placement: 'bottom',
    modifiers: [
      { name: 'offset', options: { offset: [0, 5] } },
      { name: 'preventOverflow', options: { boundary: document.body } },
    ],
    strategy: 'fixed',
  });

  const updatePosition = usePersistFunction(() => popper.update?.());

  useCanvasPan(updatePosition);
  useCanvasZoom(updatePosition);

  return (
    <>
      <Button ref={popper.setReferenceElement} isActive={isOpen} onClick={onToggle} tooltipTitle="Connectors">
        <SvgIcon icon={isStraightLink ? 'lineStraight' : 'lineCurved'} />
      </Button>

      {isOpen && (
        <Portal portalNode={document.body}>
          <div ref={popper.setPopperElement} style={popper.styles.popper} {...popper.attributes.popper}>
            <Content onClick={stopPropagation(null, true)}>
              <Button onClick={() => onChange(BaseModels.Project.LinkType.STRAIGHT)} isActive={isStraightLink} isSimple>
                <SvgIcon icon="lineStraight" />
              </Button>

              <Button onClick={() => onChange(BaseModels.Project.LinkType.CURVED)} isActive={!isStraightLink} isSimple>
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
