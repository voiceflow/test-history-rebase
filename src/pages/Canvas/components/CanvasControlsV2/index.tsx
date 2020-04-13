import React from 'react';

import IconButton from '@/components/IconButton';
import Tooltip from '@/components/TippyTooltip';
import { ModalType } from '@/constants';
import { EventualEngineContext } from '@/contexts/EventualEngineContext';
import { useHotKeys, useModals } from '@/hooks';
import { Hotkey } from '@/keymap';

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

  useHotKeys(Hotkey.OPEN_CMS_MODAL, onOpenCMS, { preventDefault: true });
  useHotKeys(Hotkey.ZOOM_IN, onZoomIn, { preventDefault: true });
  useHotKeys(Hotkey.ZOOM_OUT, onZoomOut, { preventDefault: true });
  useHotKeys(Hotkey.ROOT_NODE, onFocusHome, { preventDefault: true });

  return (
    <Container>
      <ControlContainer>
        <Tooltip distance={6} title="Home" position="top" hotkey="H">
          <IconButton icon="home" onClick={onFocusHome} />
        </Tooltip>
      </ControlContainer>

      <ControlContainer>
        <Tooltip distance={6} title="Model" position="top" hotkey="M">
          <IconButton icon="code" onClick={onOpenCMS} />
        </Tooltip>
      </ControlContainer>

      <ControlContainer>
        <Tooltip distance={6} title="Resources" position="top" hotkey="I">
          <ResourcesDropdown />
        </Tooltip>
      </ControlContainer>

      <ControlContainer>
        <ZoomContainer>
          <Tooltip distance={6} title="Zoom Out" position="top" hotkey="-">
            <IconButton icon="zoomOut" size={14} onClick={onZoomOut} />
          </Tooltip>

          <Tooltip distance={6} title="Zoom In" position="top" hotkey="+">
            <IconButton icon="zoomIn" size={14} onClick={onZoomIn} />
          </Tooltip>
        </ZoomContainer>
      </ControlContainer>
    </Container>
  );
};

export default React.memo(CanvasControlsV2);
