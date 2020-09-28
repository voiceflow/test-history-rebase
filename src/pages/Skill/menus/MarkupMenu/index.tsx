import React from 'react';

import { Flex } from '@/components/Box';
import { RemoveIntercom } from '@/components/IntercomChat';
import Tooltip from '@/components/TippyTooltip';
import { MarkupModeType } from '@/constants';
import { useHotKeys } from '@/hooks';
import { Hotkey } from '@/keymap';
import { MarkupModeContext } from '@/pages/Skill/contexts';
import { useEditingMode } from '@/pages/Skill/hooks';

import { MenuContainer, MenuIcon } from './components';

const MarkupMenu: React.FC = () => {
  const isEditingMode = useEditingMode();
  const { modeType, onAddImage, setCreatingModeType } = React.useContext(MarkupModeContext)!;

  const isTextActive = modeType === MarkupModeType.TEXT;

  const setTextMarkupActive = () => {
    setCreatingModeType(isTextActive ? null : MarkupModeType.TEXT);
  };

  useHotKeys(Hotkey.SELECT_IMAGE_MARKUP, onAddImage, { preventDefault: true });
  useHotKeys(Hotkey.SELECT_TEXT_MARKUP, setTextMarkupActive, { preventDefault: true });

  return (
    <>
      <MenuContainer column>
        <Flex mb={16}>
          <Tooltip distance={6} title="Text" position="right">
            <MenuIcon large icon="textAutoResize" onClick={setTextMarkupActive} active={isTextActive} />
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
