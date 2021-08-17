import { Button, Request } from '@voiceflow/base-types';
import { Box, BoxFlex, Text } from '@voiceflow/ui';
import React from 'react';

import { PrototypeLayout, PrototypeStatus } from '@/ducks/prototype/types';
import { useCanASR, useTheme } from '@/hooks';
import { ChatDisplay } from '@/pages/Prototype/components';
import { ASRSpeechbar, UncontrolledSpeechBar } from '@/pages/Prototype/components/PrototypeSpeechBar';
import { Interaction, Message } from '@/pages/Prototype/types';

import { ActionButtons, DisplayContainer, InputContainer, InteractionContainer, SpeechBarContainer, UserInput } from './components';

export interface ChatDialogProps {
  input: string;
  color?: string;
  avatarURL?: string;
  isIdle?: boolean;
  layout: PrototypeLayout;
  onStart: () => void;
  onMute: () => void;
  onSend: (request: string | Request.BaseRequest) => void;
  onPlay: (src: string) => void;
  isMuted?: boolean;
  onReset: () => void;
  messages: Message[];
  isMobile?: boolean;
  buttons?: Button.ButtonsLayout;
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
  hasInput?: boolean;
  autoScroll?: boolean;
  onStepBack: () => void;
}

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
  buttons,
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
  hasInput = true,
  autoScroll = true,
  onStepBack,
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
          buttons={buttons}
          color={color}
          avatarURL={avatarURL}
          onInteraction={onSend}
          stepBack={onStepBack}
          autoScroll={autoScroll}
        />
      </DisplayContainer>

      {hasInput && (
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
                  testEnded={testEnded}
                  disabled={isIdle}
                  isIdle={isIdle}
                  onStart={onStart}
                  isMobile={isMobile}
                />
              </>
            )}

            {layout === PrototypeLayout.VOICE_DIALOG && (
              <>
                {testEnded ? (
                  <BoxFlex flex={1}>
                    <Text fontSize={15} color={theme.colors.tertiary}>
                      This conversation has ended
                    </Text>
                  </BoxFlex>
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
                  isIdle={isIdle}
                  onStart={onStart}
                  testEnded={testEnded}
                  isMobile={isMobile}
                />
              </>
            )}
          </InputContainer>
        </InteractionContainer>
      )}
    </Box>
  );
};

export default ChatDialog;
