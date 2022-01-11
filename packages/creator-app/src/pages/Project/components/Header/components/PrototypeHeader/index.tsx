import { Box } from '@voiceflow/ui';
import React from 'react';

import { Header, HeaderBackButton, HeaderHotkeyToAction } from '@/components/ProjectPage';
import { FeatureFlag } from '@/config/features';
import * as Router from '@/ducks/router';
import { useDispatch, useFeature } from '@/hooks';
import { Hotkey } from '@/keymap';

import { Content, Settings, Share, Timer } from './components';

const PrototypeHeader: React.FC = () => {
  const goToCurrentCanvas = useDispatch(Router.goToCurrentCanvas);
  const { isEnabled: hasVariableStates } = useFeature(FeatureFlag.VARIABLE_STATES);

  return (
    <Header renderLogoButton={() => <HeaderBackButton onClick={() => goToCurrentCanvas()} />}>
      <HeaderHotkeyToAction label="to return to designer" hotkey={Hotkey.CLOSE_CANVAS_MODE} onHotkey={goToCurrentCanvas} preventDefault />

      <Content>
        <Timer />
      </Content>
      {hasVariableStates && <Settings />}
      <Share />

      <Box width={16} />
    </Header>
  );
};

export default PrototypeHeader;
