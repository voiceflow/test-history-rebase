import { BaseButton } from '@voiceflow/base-types';
import { Nullable } from '@voiceflow/common';
import { Box, BoxFlex, Flex, Text } from '@voiceflow/ui';
import React from 'react';

import { PrototypeLayout, PrototypeStatus } from '@/constants/prototype';
import { useCanASR, useTheme } from '@/hooks';
import { ChatDisplay } from '@/pages/Prototype/components';
import { ASRSpeechbar, UncontrolledSpeechBar } from '@/pages/Prototype/components/PrototypeSpeechBar';
import { Interaction, Message, OnInteraction, PMStatus } from '@/pages/Prototype/types';

import {
  ActionButtons,
  DisplayContainer,
  FadeInWrapper,
  InputContainer,
  InputWrapper,
  InteractionContainer,
  SpeechBarContainer,
  UserInput,
} from './components';

export interface ChatDialogProps {
  audio?: HTMLAudioElement;
  input: string;
  color?: string;
  isIdle?: boolean;
  locale: string;
  layout: PrototypeLayout;
  onMute: VoidFunction;
  onPause: VoidFunction;
  onReset: VoidFunction;
  onStart: VoidFunction;
  isMuted?: boolean;
  buttons?: BaseButton.ButtonsLayout;
  messages: Message[];
  pmStatus: Nullable<PMStatus>;
  isMobile?: boolean;
  hasInput?: boolean;
  isLoading?: boolean;
  testEnded?: boolean;
  avatarURL?: string;
  autoScroll?: boolean;
  onStepBack: VoidFunction;
  onContinue: VoidFunction;
  buttonsOnly: boolean;
  isListening?: boolean;
  interactions: Interaction[];
  onInteraction: OnInteraction;
  onInputChange: (input: string) => void;
  prototypeStatus: PrototypeStatus;
  finalTranscript: string;
  onStopListening: VoidFunction;
  onStartListening: VoidFunction;
  interimTranscript: string;
  onCheckMicrophonePermission?: VoidFunction;
  isMicrophonePermissionGranted?: boolean;
  isSpeechSpeechRecognitionSupported?: boolean;
}

const ChatDialog: React.FC<ChatDialogProps> = ({
  audio,
  input,
  color,
  onMute,
  isIdle,
  layout,
  locale,
  onPause,
  onStart,
  isMuted,
  onReset,
  buttons,
  messages,
  hasInput = true,
  pmStatus,
  isMobile,
  isLoading,
  avatarURL,
  testEnded,
  autoScroll = true,
  onContinue,
  onStepBack,
  buttonsOnly,
  isListening,
  interactions,
  onInputChange,
  onInteraction,
  prototypeStatus,
  finalTranscript,
  onStopListening,
  onStartListening,
  interimTranscript,
  onCheckMicrophonePermission,
  isMicrophonePermissionGranted,
  isSpeechSpeechRecognitionSupported,
}) => {
  const theme = useTheme();
  const [canUseASR] = useCanASR();

  const showInputContainer = !buttonsOnly || !isIdle || testEnded || layout !== PrototypeLayout.TEXT_DIALOG;
  const showInput = !buttonsOnly || (buttonsOnly && pmStatus === PMStatus.WAITING_USER_INTERACTION && interactions.length === 0);

  return (
    <Box height="100%" width="100%" position="relative">
      <DisplayContainer isMobile={isMobile}>
        <ChatDisplay
          audio={audio}
          pmStatus={pmStatus}
          onPause={onPause}
          onContinue={onContinue}
          status={prototypeStatus}
          messages={messages}
          isLoading={isLoading}
          interactions={interactions}
          isMobile={isMobile}
          hideSessionMessages
          showPadding
          buttons={buttons}
          color={color}
          avatarURL={avatarURL}
          stepBack={onStepBack}
          autoScroll={autoScroll}
          onInteraction={onInteraction}
        />
      </DisplayContainer>

      {hasInput && (
        <InteractionContainer isMobile={isMobile}>
          <InputWrapper isMobile={isMobile}>
            {showInputContainer && (
              <FadeInWrapper height={buttonsOnly ? 19 : 0}>
                <InputContainer isMobile={isMobile}>
                  {layout === PrototypeLayout.TEXT_DIALOG && (
                    <Flex>
                      <UserInput
                        isMobile={isMobile}
                        isIdle={isIdle}
                        testEnded={testEnded}
                        value={input}
                        onEnterPress={() => onInteraction({ request: input })}
                        onChange={onInputChange}
                        onStart={onStart}
                        hideInput={!showInput}
                        buttonsOnly={buttonsOnly}
                      />
                      <ActionButtons
                        color={color}
                        onMute={onMute}
                        onSend={() => onInteraction({ request: input })}
                        isMuted={isMuted}
                        onReset={onReset}
                        testEnded={testEnded}
                        disabled={isIdle}
                        isIdle={isIdle}
                        onStart={onStart}
                        isMobile={isMobile}
                        buttonsOnly={!showInput}
                        noSend={!showInput}
                      />
                    </Flex>
                  )}
                  {layout === PrototypeLayout.VOICE_DIALOG && (
                    <Flex>
                      {testEnded ? (
                        <BoxFlex flex={1}>
                          <Text fontSize={15} color={theme.colors.secondary}>
                            This conversation has ended
                          </Text>
                        </BoxFlex>
                      ) : (
                        <SpeechBarContainer>
                          {canUseASR ? (
                            <ASRSpeechbar
                              onTranscript={(text) => onInteraction({ request: text })}
                              onCheckMicrophonePermission={onCheckMicrophonePermission}
                              isMicrophonePermissionGranted={isMicrophonePermissionGranted}
                              locale={locale}
                            />
                          ) : (
                            <UncontrolledSpeechBar
                              disabled={isIdle}
                              isMobile={isMobile}
                              isListening={isListening}
                              isSupported={isSpeechSpeechRecognitionSupported}
                              finalTranscript={finalTranscript}
                              onStopListening={onStopListening}
                              onStartListening={onStartListening}
                              interimTranscript={interimTranscript}
                              onCheckMicrophonePermission={onCheckMicrophonePermission}
                              isMicrophonePermissionGranted={isMicrophonePermissionGranted}
                              colorScheme={color}
                            />
                          )}
                        </SpeechBarContainer>
                      )}

                      <ActionButtons
                        color={color}
                        onMute={onMute}
                        onSend={() => onInteraction({ request: input })}
                        noSend
                        isMuted={isMuted}
                        onReset={onReset}
                        disabled={isIdle}
                        isIdle={isIdle}
                        onStart={onStart}
                        testEnded={testEnded}
                        isMobile={isMobile}
                      />
                    </Flex>
                  )}
                </InputContainer>
              </FadeInWrapper>
            )}
          </InputWrapper>
        </InteractionContainer>
      )}
    </Box>
  );
};

export default ChatDialog;
