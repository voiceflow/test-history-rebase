import { Locale } from '@voiceflow/alexa-types';
import React from 'react';
import { Tooltip } from 'react-tippy';

import Box, { Flex } from '@/components/Box';
import Button from '@/components/Button';
import { ButtonVariant } from '@/components/Button/constants';
import SvgIcon from '@/components/SvgIcon';
import { InputMode, prototypeInputModeSelector, prototypeShowChipsSelector, updatePrototype } from '@/ducks/prototype';
import { connect } from '@/hocs';
import { Identifier } from '@/styles/constants';
import { ConnectedProps } from '@/types';
import { preventDefault, withEnterPress } from '@/utils/dom';

import SpeechBar from '../PrototypeSpeechBar';
import { ControlButton, InputArea, InputContainer } from './components';

const InputAreaComp: React.FC<any> = InputArea;
export type PrototypeInputProps = {
  locale: Locale;
  disabled?: boolean;
  isPublic?: boolean;
  onUserInput: (input: string) => void;
  showChips: boolean;
  setShowChips: (val: boolean) => void;
};

const PrototypeInput: React.FC<PrototypeInputProps & ConnectedPrototypeInputProps> = ({
  inputMode,
  showChips,
  updatePrototype,
  locale,
  disabled,
  setShowChips,
  onUserInput,
}) => {
  const [value, setValue] = React.useState('');

  const sendTextHandler = preventDefault(() => {
    if (!disabled) {
      onUserInput(value);
      setValue('');
    }
  });

  const inputRef = React.createRef<HTMLInputElement>();

  const setInputMode = (mode: InputMode) => {
    updatePrototype({ inputMode: mode });
  };

  React.useEffect(() => {
    inputRef?.current?.focus();
  }, []);

  return (
    <>
      <Flex p="10px 24px">
        <Tooltip title="Text" position="top">
          <ControlButton active={inputMode === InputMode.TEXT} onClick={() => setInputMode(InputMode.TEXT)}>
            <SvgIcon icon="text" size={16} color="#99a8b8" />
          </ControlButton>
        </Tooltip>
        <Tooltip title="Voice" position="top">
          <ControlButton active={inputMode === InputMode.VOICE} onClick={() => setInputMode(InputMode.VOICE)}>
            <SvgIcon icon="microphone" size={16} color="#99a8b8" />
          </ControlButton>
        </Tooltip>
        <Tooltip title="Chips" position="top">
          <ControlButton
            active={showChips}
            onClick={() => {
              setShowChips(!showChips);
            }}
          >
            <SvgIcon icon="touch" size={16} color="#99a8b8" />
          </ControlButton>
        </Tooltip>
      </Flex>
      <InputContainer>
        {inputMode === InputMode.TEXT ? (
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
    </>
  );
};

const mapStateToProps = { inputMode: prototypeInputModeSelector, showChips: prototypeShowChipsSelector };

const mapDispatchToProps = {
  updatePrototype,
};

type ConnectedPrototypeInputProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(PrototypeInput) as React.FC<PrototypeInputProps>;
