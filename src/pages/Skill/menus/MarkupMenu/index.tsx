import React from 'react';

import { RemoveIntercom } from '@/components/IntercomChat';
import { MarkupModeType } from '@/constants';
import { MarkupModeContext } from '@/pages/Skill/contexts';
import { useEditingMode } from '@/pages/Skill/hooks';

// import { AddShapesMenu, MarkupButtonContainer, MenuContainer, MenuIcon } from './components';
import { MarkupButtonContainer, MenuContainer, MenuIcon } from './components';

const MarkupMenu: React.FC = () => {
  const isEditingMode = useEditingMode();
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
        {/* <MarkupButtonContainer title="Shapes">
          <AddShapesMenu />
        </MarkupButtonContainer> */}
        <MarkupButtonContainer title="Image">
          <MenuIcon large icon="markupImage" onClick={onAddImage} active={modeType === MarkupModeType.IMAGE} />
        </MarkupButtonContainer>
      </MenuContainer>

      {isOpen && isEditingMode && <RemoveIntercom />}
    </>
  );
};

export default React.memo(MarkupMenu);
