import React from 'react';

import Box from '@/components/Box';
import Button from '@/components/Button';
import { ButtonVariant } from '@/components/Button/constants';
import * as Prototype from '@/ducks/prototype';
import { connect } from '@/hocs';
import Reset from '@/pages/Prototype/components/PrototypeReset';
import { useResetPrototype } from '@/pages/Prototype/hooks';
import { Identifier } from '@/styles/constants';
import { ConnectedProps } from '@/types';
import { preventDefault, withEnterPress } from '@/utils/dom';

import SpeechBar from '../PrototypeSpeechBar';
import { InputArea, InputContainer } from './components';
import ControlCenter, { ControlCenterProps } from './components/ControlCenter';

const InputAreaComp: React.FC<any> = InputArea;
export type PrototypeInputProps<L> = Pick<ControlCenterProps, 'showChips' | 'setShowChips' | 'stepBack' | 'stepForward'> & {
  locale: L;
  disabled?: boolean;
  onUserInput: (input: string) => void;
};

const PrototypeInput = <L extends string>({
  inputMode,
  showChips,
  updatePrototype,
  locale,
  disabled,
  setShowChips,
  onUserInput,
  stepForward,
  status,
  stepBack,
}: PrototypeInputProps<L> & ConnectedPrototypeInputProps) => {
  const resetPrototype = useResetPrototype();
  const [value, setValue] = React.useState('');

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
    inputRef.current?.focus();
  }, []);

  return (
    <>
      <ControlCenter
        stepForward={stepForward}
        stepBack={stepBack}
        inputMode={inputMode}
        setInputMode={setInputMode}
        showChips={showChips}
        setShowChips={setShowChips}
        inputRef={inputRef}
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
                <Button variant={ButtonVariant.SECONDARY} onClick={sendTextHandler} style={{ display: 'inline-block' }}>
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
  inputMode: Prototype.prototypeInputModeSelector,
  showChips: Prototype.prototypeShowChipsSelector,
  status: Prototype.prototypeStatusSelector,
};

const mapDispatchToProps = {
  updatePrototype: Prototype.updatePrototype,
  resetPrototype: Prototype.resetPrototype,
};

type ConnectedPrototypeInputProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(PrototypeInput) as <L>(props: PrototypeInputProps<L>) => React.ReactElement;
