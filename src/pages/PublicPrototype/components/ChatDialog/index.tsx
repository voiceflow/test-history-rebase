import React from 'react';

import Box, { Flex } from '@/components/Box';
import Text from '@/components/Text';
import { PrototypeLayout, PrototypeStatus } from '@/ducks/prototype/types';
import { useCanASR, useTheme } from '@/hooks';
import { ChatDisplay } from '@/pages/Prototype/components';
import Interactions from '@/pages/Prototype/components/PrototypeDialog/components/Interactions';
import { ASRSpeechbar, UncontrolledSpeechBar } from '@/pages/Prototype/components/PrototypeSpeechBar';
import { Interaction, Message } from '@/pages/Prototype/types';

import { ActionButtons, DisplayContainer, InputContainer, InteractionContainer, SpeechBarContainer, UserInput } from './components';

export type ChatDialogProps = {
  input: string;
  color?: string;
  avatarURL?: string;
  isIdle?: boolean;
  layout: PrototypeLayout;
  onStart: () => void;
  onMute: () => void;
  onSend: (text: string) => void;
  onPlay: (src: string) => void;
  isMuted?: boolean;
  onReset: () => void;
  messages: Message[];
  isMobile?: boolean;
  isLoading?: boolean;
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
  avatarURL,
  onMute,
  isIdle,
  onPlay,
  layout,
  onSend,
  locale,
  onStart,
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
    <Box height="100%" width="100%" position="relative">
      <DisplayContainer isMobile={isMobile}>
        <ChatDisplay
          onPlay={onPlay}
          status={prototypeStatus}
          messages={messages}
          isLoading={isLoading}
          interactions={interactions}
          isMobile={isMobile}
          hideSessionMessages
          showPadding
          color={color}
          avatarURL={avatarURL}
        >
          <Interactions interactions={interactions} onInteraction={onSend} color={color} />
        </ChatDisplay>
      </DisplayContainer>

      <InteractionContainer isMobile={isMobile}>
        <InputContainer isMobile={isMobile}>
          {layout === PrototypeLayout.TEXT_DIALOG && (
            <>
              <UserInput
                isMobile={isMobile}
                isIdle={isIdle}
                testEnded={testEnded}
                value={input}
                onEnterPress={() => onSend(input)}
                onChange={onInputChange}
                onStart={onStart}
              />

              <ActionButtons
                color={color}
                onMute={onMute}
                onSend={() => onSend(input)}
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
                      onTranscript={onSend}
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
                onSend={() => onSend(input)}
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
      </InteractionContainer>
    </Box>
  );
};

export default ChatDialog;
