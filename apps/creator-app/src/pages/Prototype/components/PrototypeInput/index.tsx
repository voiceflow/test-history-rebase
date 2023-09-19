import { Box, Button, ButtonVariant, KeyName, preventDefault, SvgIcon, ToastCallToAction, withTargetValue } from '@voiceflow/ui';
import { ICustomOptions, Text, toast } from '@voiceflow/ui-next';
import React from 'react';

import { PrototypeInputMode, PrototypeStatus } from '@/constants/prototype';
import * as CreatorV2 from '@/ducks/creatorV2';
import * as Prototype from '@/ducks/prototype';
import * as Router from '@/ducks/router';
import * as Transcripts from '@/ducks/transcript';
import * as VariableState from '@/ducks/variableState';
import { useDispatch, useSelector } from '@/hooks';
import Reset from '@/pages/Prototype/components/PrototypeReset';
import { useResetPrototype } from '@/pages/Prototype/hooks';
import { Identifier } from '@/styles/constants';
import { withEnterPress, withKeyPress } from '@/utils/dom';

import SpeechBar from '../PrototypeSpeechBar';
import { InputArea, InputContainer } from './components';
import ControlCenter, { ControlCenterProps } from './components/ControlCenter';

export type PrototypeInputProps<L> = Pick<ControlCenterProps, 'showButtons' | 'setShowButtons' | 'stepBack' | 'stepForward'> & {
  locale: L;
  disabled?: boolean;
  onUserInput: (input: string) => void;
};

const PrototypeInput = <L extends string>({
  locale,
  disabled,
  stepBack,
  onUserInput,
  stepForward,
  setShowButtons,
}: PrototypeInputProps<L>): React.ReactElement<any, any> | null => {
  const [value, setValue] = React.useState('');

  const contextStep = useSelector(Prototype.prototypeContextStepSelector);
  const inputMode = useSelector(Prototype.prototypeInputModeSelector);
  const showButtons = useSelector(Prototype.prototypeShowButtonsSelector);
  const status = useSelector(Prototype.prototypeStatusSelector);
  const diagramID = useSelector(CreatorV2.activeDiagramIDSelector);

  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  const resetPrototype = useResetPrototype();
  const goToCurrentCanvas = useDispatch(Router.goToCurrentCanvas);
  const savePrototypeSession = useDispatch(Transcripts.createTranscript);
  const goToTargetTranscript = useDispatch(Router.goToTargetTranscript);
  const updatePrototype = useDispatch(Prototype.updatePrototype);
  const selectedVariableState = useSelector(VariableState.getSelectedVariableStateSelector);

  const onSubmit = preventDefault(() => {
    if (disabled) return;

    setValue('');
    onUserInput(value);
  });

  const onSave = async () => {
    try {
      const newTranscriptID = await savePrototypeSession({ persona: selectedVariableState || undefined });
      toast.success(<Text>Test saved to Conversations</Text>, {
        actionButtonProps: {
          label: 'Go to conversation',
          onClick: () => {
            goToTargetTranscript(newTranscriptID!);
          },
        },
      } as ICustomOptions);
      // eslint-disable-next-line no-empty
    } catch (e) {}
  };

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
        inputRef={inputRef}
        stepBack={stepBack}
        inputMode={inputMode}
        showButtons={showButtons}
        stepForward={stepForward}
        setInputMode={setInputMode}
        setShowButtons={setShowButtons}
        goBackDisabled={contextStep <= 1}
        savePrototypeTest={onSave}
      />
      {status === PrototypeStatus.ENDED ? (
        <Reset onClick={() => resetPrototype()} onSave={onSave} />
      ) : (
        <InputContainer>
          {inputMode === PrototypeInputMode.TEXT ? (
            <Box pb={70}>
              <InputArea
                id={Identifier.PROTOTYPE_RESPONSE}
                value={value}
                minRows={3}
                onChange={withTargetValue(setValue)}
                inputRef={inputRef}
                onKeyDown={withKeyPress(KeyName.ESCAPE, goToCurrentCanvas)}
                onKeyPress={withEnterPress(onSubmit)}
                placeholder="Start typing..."
              />
              <Box.Flex position="absolute" bottom={20} right={24}>
                <Box display="inline-block" fontSize={13} color="#8da2b5" mr={16}>
                  Enter to send
                </Box>

                <Button id={Identifier.PROTOTYPE_RESPONSE_SEND} variant={ButtonVariant.PRIMARY} onClick={onSubmit}>
                  <SvgIcon icon="send" />
                </Button>
              </Box.Flex>
            </Box>
          ) : (
            <SpeechBar locale={locale} onTranscript={onUserInput} />
          )}
        </InputContainer>
      )}
    </>
  );
};

export default PrototypeInput;
