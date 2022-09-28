import { Box } from '@voiceflow/ui';
import React from 'react';

import { Header, HeaderBackButton, HeaderHotkeyToAction } from '@/components/ProjectPage';
import * as Router from '@/ducks/router';
import { useDispatch } from '@/hooks';
import { Hotkey } from '@/keymap';
import * as ModalsV2 from '@/ModalsV2';

import { Content, Settings, Share, Timer } from './components';

const PrototypeHeader: React.FC = () => {
  const goToCurrentCanvas = useDispatch(Router.goToCurrentCanvas);

  const variableStateManageModal = ModalsV2.useModal(ModalsV2.VariableStates.Manage);
  const variableStateCreateModal = ModalsV2.useModal(ModalsV2.VariableStates.Create);

  const disableEscHotkey = variableStateManageModal.opened || variableStateCreateModal.opened;

  return (
    <Header renderLogoButton={() => <HeaderBackButton onClick={() => goToCurrentCanvas()} />}>
      <HeaderHotkeyToAction
        label="back to designer"
        hotkey={Hotkey.CLOSE_CANVAS_MODE}
        onHotkey={goToCurrentCanvas}
        disabled={disableEscHotkey}
        preventDefault
      />

      <Content>
        <Timer />
      </Content>

      <Settings />

      <Share />

      <Box width={12} />
    </Header>
  );
};

export default PrototypeHeader;
