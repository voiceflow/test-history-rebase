import { Box } from '@voiceflow/ui';
import React from 'react';

import Page from '@/components/Page';
import { PrototypeStatus } from '@/constants/prototype';
import * as Router from '@/ducks/router';
import { useDispatch, useTrackingEvents } from '@/hooks';
import { Hotkey } from '@/keymap';
import * as ModalsV2 from '@/ModalsV2';
import { PrototypeContext } from '@/pages/Prototype/context';

import { Content, Settings, Share, Timer } from './components';

const PrototypeHeader: React.FC = () => {
  const goToCurrentCanvas = useDispatch(Router.goToCurrentCanvas);
  const [trackingEvents] = useTrackingEvents();
  const prototypeAPI = React.useContext(PrototypeContext);
  const { state } = prototypeAPI;

  const closePrototype = () => {
    goToCurrentCanvas();

    if (state.status === PrototypeStatus.ACTIVE) {
      trackingEvents.trackProjectPrototypeEnd();
    }
  };

  const variableStateManageModal = ModalsV2.useModal(ModalsV2.VariableStates.Manage);
  const variableStateCreateModal = ModalsV2.useModal(ModalsV2.VariableStates.Create);

  const disableEscHotkey = variableStateManageModal.opened || variableStateCreateModal.opened;

  return (
    <Page.Header renderLogoButton={() => <Page.Header.BackButton onClick={closePrototype} />}>
      <Page.Header.HotkeyToAction
        label="back to designer"
        hotkey={Hotkey.CLOSE_CANVAS_MODE}
        onHotkey={closePrototype}
        disabled={disableEscHotkey}
        preventDefault
      />

      <Content>
        <Timer />
      </Content>

      <Box.Flex gap={8}>
        <Settings />

        <Share />
      </Box.Flex>

      <Box width={12} />
    </Page.Header>
  );
};

export default PrototypeHeader;
