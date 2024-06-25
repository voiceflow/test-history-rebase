import { SvgIcon, TippyTooltip } from '@voiceflow/ui';
import * as React from 'react';

import { PrototypeInputMode } from '@/constants/prototype';
import * as Prototype from '@/ducks/prototype';
import { useHotkeyList, useSelector } from '@/hooks';
import { Hotkey } from '@/keymap';

import { ButtonGroupSplitter, ControlButton, ControlsContainer } from './index';

export interface ControlCenterProps {
  inputMode: PrototypeInputMode;
  setInputMode: (mode: PrototypeInputMode) => void;
  showButtons: boolean;
  setShowButtons: (val: boolean) => void;
  stepBack: VoidFunction;
  stepForward: VoidFunction;
  inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement>;
  savePrototypeTest: VoidFunction;
  goBackDisabled: boolean;
}

const ICON_COLOR = '#99a8b8';

const ControlCenter: React.FC<ControlCenterProps> = ({
  stepBack,
  stepForward,
  showButtons,
  setShowButtons,
  inputMode,
  setInputMode,
  inputRef,
  goBackDisabled,
  savePrototypeTest,
}) => {
  const history = useSelector(Prototype.prototypeContextHistorySelector);
  const contextStep = useSelector(Prototype.prototypeContextStepSelector);

  const goForwardDisabled = contextStep === history.length - 1;

  const handleOnForward = () => {
    if (goForwardDisabled) return;

    stepForward();
    inputRef.current?.focus();
  };

  const handleOnBackward = () => {
    if (goBackDisabled) return;

    stepBack();
    inputRef.current?.focus();
  };

  useHotkeyList([
    { hotkey: Hotkey.MOVE_FORWARD, callback: handleOnForward, preventDefault: true },
    { hotkey: Hotkey.MOVE_BACKWARD, callback: handleOnBackward, preventDefault: true },
  ]);

  return (
    <ControlsContainer>
      <TippyTooltip content="Text" position="top">
        <ControlButton
          active={inputMode === PrototypeInputMode.TEXT}
          onClick={() => setInputMode(PrototypeInputMode.TEXT)}
        >
          <SvgIcon icon="text" size={16} color={ICON_COLOR} />
        </ControlButton>
      </TippyTooltip>

      <TippyTooltip content="Voice" position="top">
        <ControlButton
          active={inputMode === PrototypeInputMode.VOICE}
          onClick={() => setInputMode(PrototypeInputMode.VOICE)}
        >
          <SvgIcon icon="microphone" size={16} color={ICON_COLOR} />
        </ControlButton>
      </TippyTooltip>

      <TippyTooltip content="Buttons" position="top">
        <ControlButton active={showButtons} onClick={() => setShowButtons(!showButtons)}>
          <SvgIcon icon="action" size={16} color={ICON_COLOR} />
        </ControlButton>
      </TippyTooltip>

      <ButtonGroupSplitter />

      <TippyTooltip content="Back" position="top">
        <ControlButton
          active={false}
          disabled={goBackDisabled}
          onClick={handleOnBackward}
          style={{ transform: 'scaleX(-1)' }}
        >
          <SvgIcon icon="forward" size={16} color={ICON_COLOR} />
        </ControlButton>
      </TippyTooltip>

      <TippyTooltip content="Forward" position="top">
        <ControlButton disabled={goForwardDisabled} active={false} onClick={handleOnForward}>
          <SvgIcon icon="forward" size={16} color={ICON_COLOR} />
        </ControlButton>
      </TippyTooltip>

      <ButtonGroupSplitter />
      <TippyTooltip content="Save Transcript" position="top">
        <ControlButton active={false} onClick={savePrototypeTest}>
          <SvgIcon icon="saveTest" size={16} color={ICON_COLOR} />
        </ControlButton>
      </TippyTooltip>
    </ControlsContainer>
  );
};

export default ControlCenter;
