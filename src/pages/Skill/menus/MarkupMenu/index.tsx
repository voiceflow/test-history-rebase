import React from 'react';

import { RemoveIntercom } from '@/components/IntercomChat';
import { MarkupModeType } from '@/constants';
import { EditPermissionContext, MarkupModeContext } from '@/pages/Skill/contexts';

import { AddShapesMenu, MarkupButtonContainer, MenuContainer, MenuIcon } from './components';

const MarkupMenu: React.FC = () => {
  const { canEdit: isVisible } = React.useContext(EditPermissionContext)!;
  const { isOpen, modeType, onAddImage, setCreatingModeType } = React.useContext(MarkupModeContext)!;

  const isTextActive = modeType === MarkupModeType.TEXT;

  return (
    <>
      <MenuContainer isOpen={isOpen} column>
        <MarkupButtonContainer title="Text">
          <MenuIcon
            large
            icon="textAutoResize"
            onClick={() => setCreatingModeType(isTextActive ? null : MarkupModeType.TEXT)}
            active={isTextActive}
          />
        </MarkupButtonContainer>
        <MarkupButtonContainer title="Shapes">
          <AddShapesMenu />
        </MarkupButtonContainer>
        <MarkupButtonContainer title="Image">
          <MenuIcon large icon="markupImage" onClick={onAddImage} active={modeType === MarkupModeType.IMAGE} />
        </MarkupButtonContainer>
      </MenuContainer>

      {isOpen && isVisible && <RemoveIntercom />}
    </>
  );
};

export default React.memo(MarkupMenu);
