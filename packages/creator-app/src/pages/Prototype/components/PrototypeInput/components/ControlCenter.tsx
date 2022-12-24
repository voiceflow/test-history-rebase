import { SvgIcon, TippyTooltip } from '@voiceflow/ui';
import * as React from 'react';

import { PrototypeInputMode } from '@/constants/prototype';
import * as Prototype from '@/ducks/prototype';
import { connect } from '@/hocs/connect';
import { useHotKeys } from '@/hooks';
import { Hotkey } from '@/keymap';
import { ConnectedProps } from '@/types';

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

const ControlCenter: React.FC<ConnectedControlCenterProps & ControlCenterProps> = ({
  stepBack,
  stepForward,
  history,
  showButtons,
  setShowButtons,
  inputMode,
  setInputMode,
  inputRef,
  contextStep,
  goBackDisabled,
  savePrototypeTest,
}) => {
  const goForwardDisabled = contextStep === history.length - 1;

  const handleOnForward = React.useCallback(() => {
    if (!goForwardDisabled) {
      stepForward();
      inputRef.current?.focus();
    }
  }, [goForwardDisabled, stepForward]);

  const handleOnBackward = React.useCallback(() => {
    if (!goBackDisabled) {
      stepBack();
      inputRef.current?.focus();
    }
  }, [goBackDisabled, stepBack]);

  useHotKeys(Hotkey.MOVE_FORWARD, handleOnForward, { preventDefault: true }, [goForwardDisabled]);
  useHotKeys(Hotkey.MOVE_BACKWARD, handleOnBackward, { preventDefault: true }, [goBackDisabled]);

  return (
    <ControlsContainer>
      <TippyTooltip title="Text" position="top">
        <ControlButton active={inputMode === PrototypeInputMode.TEXT} onClick={() => setInputMode(PrototypeInputMode.TEXT)}>
          <SvgIcon icon="text" size={16} color={ICON_COLOR} />
        </ControlButton>
      </TippyTooltip>

      <TippyTooltip title="Voice" position="top">
        <ControlButton active={inputMode === PrototypeInputMode.VOICE} onClick={() => setInputMode(PrototypeInputMode.VOICE)}>
          <SvgIcon icon="microphone" size={16} color={ICON_COLOR} />
        </ControlButton>
      </TippyTooltip>

      <TippyTooltip title="Buttons" position="top">
        <ControlButton active={showButtons} onClick={() => setShowButtons(!showButtons)}>
          <SvgIcon icon="action" size={16} color={ICON_COLOR} />
        </ControlButton>
      </TippyTooltip>

      <ButtonGroupSplitter />

      <TippyTooltip title="Back" position="top">
        <ControlButton active={false} disabled={goBackDisabled} onClick={handleOnBackward} style={{ transform: 'scaleX(-1)' }}>
          <SvgIcon icon="forward" size={16} color={ICON_COLOR} />
        </ControlButton>
      </TippyTooltip>

      <TippyTooltip title="Forward" position="top">
        <ControlButton disabled={goForwardDisabled} active={false} onClick={handleOnForward}>
          <SvgIcon icon="forward" size={16} color={ICON_COLOR} />
        </ControlButton>
      </TippyTooltip>

      <ButtonGroupSplitter />
      <TippyTooltip title="Save Transcript" position="top">
        <ControlButton active={false} onClick={savePrototypeTest}>
          <SvgIcon icon="saveTest" size={16} color={ICON_COLOR} />
        </ControlButton>
      </TippyTooltip>
    </ControlsContainer>
  );
};

const mapStateToProps = {
  history: Prototype.prototypeContextHistorySelector,
  contextStep: Prototype.prototypeContextStepSelector,
};

type ConnectedControlCenterProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(ControlCenter) as React.FC<ControlCenterProps>;
