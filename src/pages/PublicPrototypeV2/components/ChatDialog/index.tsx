import React from 'react';

import Box, { Flex } from '@/components/Box';
import Text from '@/components/Text';
import { PrototypeLayout, PrototypeStatus } from '@/ducks/prototype/types';
import { useCanASR, useTheme } from '@/hooks';
import { ChatDisplay } from '@/pages/Prototype/components';
import { ASRSpeechbar, UncontrolledSpeechBar } from '@/pages/Prototype/components/PrototypeSpeechBar';
import { Interaction, Message } from '@/pages/Prototype/types';

import { ActionButtons, Chips, DisplayContainer, InputContainer, SpeechBarContainer, SuggestionsContainer, UserInput } from './components';

export type ChatDialogProps = {
  input: string;
  color?: string;
  isIdle?: boolean;
  layout: PrototypeLayout;
  onMute: () => void;
  onSend: (text?: string) => void;
  onPlay: (src: string) => void;
  isMuted?: boolean;
  onReset: () => void;
  messages: Message[];
  isMobile?: boolean;
  isLoading?: boolean;
  onTranscript: (request: string) => Promise<void>;
  testEnded?: boolean;
  isListening?: boolean;
  interactions: Interaction[];
  onInputChange: (input: string) => void;
  prototypeStatus: PrototypeStatus;
  finalTranscript: string;
  onStopListening: () => void;
  onStartListening: () => void;
  locale: string;
  interimTranscript: string;
  onCheckMicrophonePermission?: () => void;
  isMicrophonePermissionGranted?: boolean;
  isSpeechSpeechRecognitionSupported?: boolean;
};

const ChatDialog: React.FC<ChatDialogProps> = ({
  input,
  color,
  onMute,
  isIdle,
  onPlay,
  layout,
  onSend,
  isMuted,
  onReset,
  messages,
  isMobile,
  isLoading,
  testEnded,
  isListening,
  interactions,
  onInputChange,
  prototypeStatus,
  finalTranscript,
  onTranscript,
  locale,
  onStopListening,
  onStartListening,
  interimTranscript,
  onCheckMicrophonePermission,
  isMicrophonePermissionGranted,
  isSpeechSpeechRecognitionSupported,
}) => {
  const theme = useTheme();
  const [canUseASR] = useCanASR();

  return (
    <Box height="100%" width="100%">
      <DisplayContainer isMobile={isMobile} showSuggestions={interactions.length > 0}>
        <ChatDisplay
          onPlay={onPlay}
          status={prototypeStatus}
          messages={messages}
          isLoading={isLoading}
          interactions={interactions}
          hideSessionMessages
        />
      </DisplayContainer>

      {interactions.length > 0 && (
        <SuggestionsContainer>
          <Flex p="0 32px" flexWrap="nowrap" justifyContent="center">
            {interactions.map(({ name }) => (
              <Chips key={name} color={color} onClick={() => onSend(name)}>
                {name}
              </Chips>
            ))}
          </Flex>
        </SuggestionsContainer>
      )}

      <InputContainer isMobile={isMobile}>
        {layout === PrototypeLayout.TEXT_DIALOG && (
          <>
            <UserInput isIdle={isIdle} testEnded={testEnded} value={input} onEnterPress={() => onSend()} onChange={onInputChange} />

            <ActionButtons
              color={color}
              onMute={onMute}
              onSend={onSend}
              isMuted={isMuted}
              onReset={onReset}
              disabled={isIdle}
              testEnded={testEnded}
              isMobile={isMobile}
            />
          </>
        )}

        {layout === PrototypeLayout.VOICE_DIALOG && (
          <>
            {testEnded ? (
              <Flex flex={1}>
                <Text fontSize={15} color={theme.colors.tertiary}>
                  This conversation has ended
                </Text>
              </Flex>
            ) : (
              <SpeechBarContainer>
                {canUseASR ? (
                  <ASRSpeechbar
                    onTranscript={onTranscript}
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
                  />
                )}
              </SpeechBarContainer>
            )}

            <ActionButtons
              color={color}
              onMute={onMute}
              onSend={onSend}
              noSend
              isMuted={isMuted}
              onReset={onReset}
              disabled={isIdle}
              testEnded={testEnded}
              isMobile={isMobile}
            />
          </>
        )}
      </InputContainer>
    </Box>
  );
};

export default ChatDialog;
