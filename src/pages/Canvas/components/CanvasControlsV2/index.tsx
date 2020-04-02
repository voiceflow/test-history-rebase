import React from 'react';

import IconButton from '@/components/IconButton';
import Tooltip from '@/components/TippyTooltip';
import { isMac } from '@/config';
import { ModalType } from '@/constants';
import { EventualEngineContext } from '@/contexts/EventualEngineContext';
import { useHotKeys, useModals } from '@/hooks';
import { Hotkey } from '@/keymap';
import { preventDefault } from '@/utils/dom';

import { Container, ControlContainer, ResourcesDropdown, ZoomContainer } from './components';

const ZOOM_DELTA = 15;

const CanvasControlsV2: React.FC = () => {
  const { open } = useModals(ModalType.INTERACTION_MODEL);

  const eventualEngine = React.useContext(EventualEngineContext)!;

  const onZoomIn = React.useCallback(() => {
    eventualEngine.get().canvas.applyTransition();
    eventualEngine.get().canvas.zoomIn(ZOOM_DELTA);
  }, [eventualEngine]);

  const onZoomOut = React.useCallback(() => {
    eventualEngine.get().canvas.applyTransition();
    eventualEngine.get().canvas.zoomOut(ZOOM_DELTA);
  }, [eventualEngine]);

  const onFocusHome = React.useCallback(() => {
    eventualEngine.get().focusHome();
  }, [eventualEngine]);

  // this callback is needed to do not store event object in the modals context
  const onOpenCMS = React.useCallback(() => open(), []);

  useHotKeys(Hotkey.OPEN_CMS_MODAL, preventDefault(onOpenCMS));
  useHotKeys(Hotkey.ZOOM_IN, preventDefault(onZoomIn));
  useHotKeys(Hotkey.ZOOM_OUT, preventDefault(onZoomOut));
  useHotKeys(Hotkey.ROOT_NODE, preventDefault(onFocusHome));

  return (
    <Container>
      <ControlContainer>
        <Tooltip distance={6} title="Model" position="top" systemHotkey="M">
          <IconButton icon="code" onClick={onOpenCMS} />
        </Tooltip>
      </ControlContainer>

      <ControlContainer>
        <Tooltip distance={6} title="Resources" position="top" systemHotkey="I">
          <ResourcesDropdown />
        </Tooltip>
      </ControlContainer>

      <ControlContainer>
        <Tooltip distance={6} title={`${isMac ? '⌘' : 'Ctrl'} + Scroll to Zoom`} position="top">
          <ZoomContainer>
            <IconButton icon="zoomOut" size={14} onClick={onZoomOut} />

            <IconButton icon="zoomIn" size={14} onClick={onZoomIn} />
          </ZoomContainer>
        </Tooltip>
      </ControlContainer>
    </Container>
  );
};

export default CanvasControlsV2;
