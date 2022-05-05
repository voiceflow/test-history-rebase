import { Box } from '@voiceflow/ui';
import React from 'react';

import { Header, HeaderBackButton, HeaderHotkeyToAction } from '@/components/ProjectPage';
import { ModalType } from '@/constants';
import * as Router from '@/ducks/router';
import { useDispatch, useModals } from '@/hooks';
import { Hotkey } from '@/keymap';

import { Content, Settings, Share, Timer } from './components';

const PrototypeHeader: React.FC = () => {
  const goToCurrentCanvas = useDispatch(Router.goToCurrentCanvas);
  const { isOpened: isVariableStateManagerModalOpened } = useModals(ModalType.VARIABLE_STATES_MANAGER_MODAL);
  const { isOpened: isVariableStateEditorModalOpened } = useModals(ModalType.VARIABLE_STATE_EDITOR_MODAL);
  const disableEscHotkey = isVariableStateManagerModalOpened || isVariableStateEditorModalOpened;

  return (
    <Header renderLogoButton={() => <HeaderBackButton onClick={() => goToCurrentCanvas()} />}>
      <HeaderHotkeyToAction
        label="to return to designer"
        hotkey={Hotkey.CLOSE_CANVAS_MODE}
        onHotkey={goToCurrentCanvas}
        preventDefault
        disabled={disableEscHotkey}
      />

      <Content>
        <Timer />
      </Content>
      <Settings />
      <Share />

      <Box width={16} />
    </Header>
  );
};

export default PrototypeHeader;
