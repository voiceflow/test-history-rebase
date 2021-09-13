import { Box, Button, ButtonVariant, preventDefault } from '@voiceflow/ui';
import React from 'react';

import * as Creator from '@/ducks/creator';
import * as Prototype from '@/ducks/prototype';
import { connect } from '@/hocs';
import Reset from '@/pages/Prototype/components/PrototypeReset';
import { useResetPrototype } from '@/pages/Prototype/hooks';
import { Identifier } from '@/styles/constants';
import { ConnectedProps } from '@/types';
import { withEnterPress } from '@/utils/dom';

import SpeechBar from '../PrototypeSpeechBar';
import { InputArea, InputContainer } from './components';
import ControlCenter, { ControlCenterProps } from './components/ControlCenter';

const InputAreaComp: React.FC<any> = InputArea;
export type PrototypeInputProps<L> = Pick<ControlCenterProps, 'showButtons' | 'setShowButtons' | 'stepBack' | 'stepForward'> & {
  locale: L;
  disabled?: boolean;
  onUserInput: (input: string) => void;
};

const PrototypeInput = <L extends string>({
  inputMode,
  showButtons,
  updatePrototype,
  locale,
  disabled,
  setShowButtons,
  onUserInput,
  stepForward,
  diagramID,
  status,
  stepBack,
  contextStep,
}: PrototypeInputProps<L> & ConnectedPrototypeInputProps) => {
  const resetPrototype = useResetPrototype();
  const [value, setValue] = React.useState('');
  const goBackDisabled = contextStep <= 1;

  const sendTextHandler = preventDefault(() => {
    if (!disabled) {
      onUserInput(value);
      setValue('');
    }
  });

  const inputRef = React.useRef<HTMLInputElement>(null);

  const setInputMode = (mode: Prototype.InputMode) => {
    updatePrototype({ inputMode: mode });
  };

  React.useEffect(() => {
    // For some ODD reason, focusing the input on a diagram change
    // sets the focus correctly, but it doesn't set the cursor in the input
    // so we have to blur it first, then re focus to get the cursor to show up.
    inputRef.current?.blur();
    inputRef.current?.focus();
  }, [diagramID]);

  return (
    <>
      <ControlCenter
        stepForward={stepForward}
        stepBack={stepBack}
        inputMode={inputMode}
        setInputMode={setInputMode}
        showButtons={showButtons}
        setShowButtons={setShowButtons}
        inputRef={inputRef}
        goBackDisabled={goBackDisabled}
      />
      {status === Prototype.PrototypeStatus.ENDED ? (
        <Reset onClick={resetPrototype} />
      ) : (
        <InputContainer>
          {inputMode === Prototype.InputMode.TEXT ? (
            <Box pb={70}>
              <InputAreaComp
                id={Identifier.PROTOTYPE_RESPONSE}
                value={value}
                minRows={3}
                onChange={(e: any) => setValue(e.target.value)}
                onKeyPress={withEnterPress(sendTextHandler)}
                placeholder="Start typing..."
                inputRef={inputRef}
              />
              <Box position="absolute" bottom={20} right={24}>
                <Box display="inline-block" fontSize={13} color="#8da2b5" mr={16}>
                  Press enter to
                </Box>
                <Button
                  id={Identifier.PROTOTYPE_RESPONSE_SEND}
                  style={{ display: 'inline-block' }}
                  variant={ButtonVariant.SECONDARY}
                  onClick={sendTextHandler}
                >
                  Send
                </Button>
              </Box>
            </Box>
          ) : (
            <SpeechBar locale={locale} onTranscript={onUserInput} />
          )}
        </InputContainer>
      )}
    </>
  );
};

const mapStateToProps = {
  contextStep: Prototype.prototypeContextStepSelector,
  inputMode: Prototype.prototypeInputModeSelector,
  showButtons: Prototype.prototypeShowButtonsSelector,
  status: Prototype.prototypeStatusSelector,
  diagramID: Creator.creatorDiagramIDSelector,
};

const mapDispatchToProps = {
  updatePrototype: Prototype.updatePrototype,
  resetPrototype: Prototype.resetPrototype,
};

type ConnectedPrototypeInputProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(PrototypeInput) as <L>(props: PrototypeInputProps<L>) => React.ReactElement;
