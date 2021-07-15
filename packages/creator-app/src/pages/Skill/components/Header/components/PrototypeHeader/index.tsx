import { Box } from '@voiceflow/ui';
import React from 'react';

import { Header, HeaderBackButton, HeaderHotkeyToAction } from '@/components/ProjectPage';
import * as Router from '@/ducks/router';
import { useDispatch } from '@/hooks';
import { Hotkey } from '@/keymap';

import { Content, Share, Timer } from './components';

const PrototypeHeader: React.FC = () => {
  const goToCurrentCanvas = useDispatch(Router.goToCurrentCanvas);

  return (
    <Header renderLogoButton={() => <HeaderBackButton onClick={() => goToCurrentCanvas()} />}>
      <HeaderHotkeyToAction label="to return to designer" hotkey={Hotkey.CLOSE_CANVAS_MODE} onHotkey={goToCurrentCanvas} preventDefault />

      <Content>
        <Timer />
      </Content>

      <Share />

      <Box width={30} />
    </Header>
  );
};

export default PrototypeHeader;
