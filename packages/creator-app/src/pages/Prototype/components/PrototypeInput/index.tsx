import { Box, BoxFlex, Button, ButtonVariant, KeyName, preventDefault, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { PrototypeInputMode, PrototypeStatus } from '@/constants/prototype';
import * as CreatorV2 from '@/ducks/creatorV2';
import * as Prototype from '@/ducks/prototype';
import * as Router from '@/ducks/router';
import { connect } from '@/hocs';
import { useDispatch } from '@/hooks';
import Reset from '@/pages/Prototype/components/PrototypeReset';
import { useResetPrototype } from '@/pages/Prototype/hooks';
import { Identifier } from '@/styles/constants';
import { ConnectedProps } from '@/types';
import { withEnterPress, withKeyPress } from '@/utils/dom';

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
  const goToCurrentCanvas = useDispatch(Router.goToCurrentCanvas);

  const sendTextHandler = preventDefault(() => {
    if (!disabled) {
      onUserInput(value);
      setValue('');
    }
  });

  const inputRef = React.useRef<HTMLInputElement>(null);

  const setInputMode = (mode: PrototypeInputMode) => {
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
      {status === PrototypeStatus.ENDED ? (
        <Reset onClick={resetPrototype} />
      ) : (
        <InputContainer>
          {inputMode === PrototypeInputMode.TEXT ? (
            <Box pb={70}>
              <InputAreaComp
                id={Identifier.PROTOTYPE_RESPONSE}
                value={value}
                minRows={3}
                onChange={(e: any) => setValue(e.target.value)}
                onKeyPress={withEnterPress(sendTextHandler)}
                onKeyDown={withKeyPress(KeyName.ESCAPE, goToCurrentCanvas)}
                placeholder="Start typing..."
                inputRef={inputRef}
              />
              <BoxFlex position="absolute" bottom={20} right={24}>
                <Box display="inline-block" fontSize={13} color="#8da2b5" mr={16}>
                  Enter to send
                </Box>

                <Button id={Identifier.PROTOTYPE_RESPONSE_SEND} variant={ButtonVariant.PRIMARY} onClick={sendTextHandler} squareRadius>
                  <SvgIcon icon="send" />
                </Button>
              </BoxFlex>
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
  diagramID: CreatorV2.activeDiagramIDSelector,
};

const mapDispatchToProps = {
  updatePrototype: Prototype.updatePrototype,
  resetPrototype: Prototype.resetPrototype,
};

type ConnectedPrototypeInputProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(PrototypeInput) as <L>(props: PrototypeInputProps<L>) => React.ReactElement;
