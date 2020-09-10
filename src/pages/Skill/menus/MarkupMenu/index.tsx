import React from 'react';

import { Flex } from '@/components/Box';
import { RemoveIntercom } from '@/components/IntercomChat';
import Tooltip from '@/components/TippyTooltip';
import { MarkupModeType } from '@/constants';
import { MarkupModeContext } from '@/pages/Skill/contexts';
import { useEditingMode } from '@/pages/Skill/hooks';

import { MenuContainer, MenuIcon } from './components';

const MarkupMenu: React.FC = () => {
  const isEditingMode = useEditingMode();
  const { modeType, onAddImage, setCreatingModeType } = React.useContext(MarkupModeContext)!;

  const isTextActive = modeType === MarkupModeType.TEXT;

  return (
    <>
      <MenuContainer column>
        <Flex mb={16}>
          <Tooltip distance={6} title="Text" position="right">
            <MenuIcon
              large
              icon="textAutoResize"
              onClick={() => setCreatingModeType(isTextActive ? null : MarkupModeType.TEXT)}
              active={isTextActive}
            />
          </Tooltip>
        </Flex>
        <Flex mb={16}>
          <Tooltip distance={6} title="Image" position="right">
            <MenuIcon large icon="markupImage" onClick={onAddImage} active={modeType === MarkupModeType.IMAGE} />
          </Tooltip>
        </Flex>
      </MenuContainer>

      {isEditingMode && <RemoveIntercom />}
    </>
  );
};

export default React.memo(MarkupMenu);
