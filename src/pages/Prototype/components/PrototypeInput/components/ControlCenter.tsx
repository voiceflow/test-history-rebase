import * as React from 'react';

import SvgIcon from '@/components/SvgIcon';
import Tooltip from '@/components/TippyTooltip';
import * as Prototype from '@/ducks/prototype';
import { connect } from '@/hocs';
import { useHotKeys } from '@/hooks';
import { Hotkey } from '@/keymap';
import { ConnectedProps } from '@/types';

import { ButtonGroupSplitter, ControlButton, ControlsContainer } from './index';

export type ControlCenterProps = {
  inputMode: Prototype.InputMode;
  setInputMode: (mode: Prototype.InputMode) => void;
  showChips: boolean;
  setShowChips: (val: boolean) => void;
  stepBack: () => void;
  stepForward: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
};

const ICON_COLOR = '#99a8b8';

const ControlCenter: React.FC<ConnectedControlCenterProps & ControlCenterProps> = ({
  stepBack,
  stepForward,
  history,
  showChips,
  setShowChips,
  inputMode,
  setInputMode,
  inputRef,
  contextStep,
}) => {
  const goBackDisabled = contextStep <= 1;
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
      <Tooltip title="Text" position="top">
        <ControlButton active={inputMode === Prototype.InputMode.TEXT} onClick={() => setInputMode(Prototype.InputMode.TEXT)}>
          <SvgIcon icon="text" size={16} color={ICON_COLOR} />
        </ControlButton>
      </Tooltip>
      <Tooltip title="Voice" position="top">
        <ControlButton active={inputMode === Prototype.InputMode.VOICE} onClick={() => setInputMode(Prototype.InputMode.VOICE)}>
          <SvgIcon icon="microphone" size={16} color={ICON_COLOR} />
        </ControlButton>
      </Tooltip>
      <Tooltip title="Chips" position="top">
        <ControlButton
          active={showChips}
          onClick={() => {
            setShowChips(!showChips);
          }}
        >
          <SvgIcon icon="touch" size={16} color={ICON_COLOR} />
        </ControlButton>
      </Tooltip>
      <ButtonGroupSplitter />
      <Tooltip title="Back" position="top">
        <ControlButton active={false} disabled={goBackDisabled} onClick={handleOnBackward} style={{ transform: 'scaleX(-1)' }}>
          <SvgIcon icon="forward" size={16} color={ICON_COLOR} />
        </ControlButton>
      </Tooltip>
      <Tooltip title="Forward" position="top">
        <ControlButton disabled={goForwardDisabled} active={false} onClick={handleOnForward}>
          <SvgIcon icon="forward" size={16} color={ICON_COLOR} />
        </ControlButton>
      </Tooltip>
      <ButtonGroupSplitter />
    </ControlsContainer>
  );
};

const mapStateToProps = {
  contextStep: Prototype.prototypeContextStepSelector,
  history: Prototype.prototypeContextHistorySelector,
};

type ConnectedControlCenterProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(ControlCenter) as React.FC<ControlCenterProps>;
