import React from 'react';

import { RemoveIntercom } from '@/components/IntercomChat';
import { MarkupModeType } from '@/constants';
import { EditPermissionContext, MarkupModeContext } from '@/pages/Skill/contexts';

import { AddShapesMenu, MenuContainer, MenuIcon } from './components';

const MarkupMenu: React.FC = () => {
  const { canEdit: isVisible } = React.useContext(EditPermissionContext)!;
  const { isOpen, modeType, onAddImage, setCreatingModeType } = React.useContext(MarkupModeContext)!;

  const isTextActive = modeType === MarkupModeType.TEXT;

  return (
    <>
      <MenuContainer isOpen={isOpen} column>
        <MenuIcon large icon="textAutoResize" onClick={() => setCreatingModeType(isTextActive ? null : MarkupModeType.TEXT)} active={isTextActive} />
        <AddShapesMenu />
        <MenuIcon large icon="markupImage" onClick={onAddImage} active={modeType === MarkupModeType.IMAGE} />
      </MenuContainer>

      {isOpen && isVisible && <RemoveIntercom />}
    </>
  );
};

export default React.memo(MarkupMenu);
