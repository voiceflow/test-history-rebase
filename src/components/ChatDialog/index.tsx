import React from 'react';

import { Flex } from '@/components/Box';
import Text from '@/components/Text';
import { PrototypeLayout, PrototypeStatus } from '@/ducks/prototype/types';
import { useTheme } from '@/hooks';
import { ChatDisplay } from '@/pages/Prototype/components';
import SpeechBar from '@/pages/Prototype/components/PrototypeSpeechBar';
import { usePrototype } from '@/pages/Prototype/hooks';
import { PMStatus } from '@/pages/Prototype/types';

import { ActionButtons, Chips, DisplayContainer, InputContainer, SuggestionsContainer, UserInput } from './components';
import { ActionButtonsProps } from './components/ActionButtons';

export type ChatDialogProps = ActionButtonsProps & {
  input?: string;
  onInputChange: (input?: string) => void;
  suggestions?: string[];
  layout: PrototypeLayout;
  locale: string;
  prototypeStatus: PrototypeStatus;
};

const ChatDialog: React.FC<ChatDialogProps> = ({ input = '', onInputChange, suggestions = [], layout, locale, prototypeStatus, ...props }) => {
  const theme = useTheme();

  const { status: prototypeMachineStatus, messages, interactions, onInteraction, onPlay } = usePrototype({
    prototypeStatus,
    debug: false,
  });
  const checkPMStatus = React.useCallback((...args: PMStatus[]) => args.includes(prototypeMachineStatus as PMStatus), [prototypeMachineStatus]);

  const isLoading = checkPMStatus(PMStatus.FETCHING_CONTEXT, PMStatus.DIALOG_PROCESSING);

  return (
    <Flex height="100%" width="100%" position="relative">
      <DisplayContainer showSuggestions={suggestions.length > 0}>
        <ChatDisplay
          isLoading={isLoading}
          messages={messages}
          interactions={interactions}
          onPlay={onPlay}
          onInteraction={onInteraction}
          status={prototypeStatus}
        />
      </DisplayContainer>
      {suggestions.length > 0 && (
        <SuggestionsContainer>
          <Flex p="0 32px" flexWrap="nowrap" justifyContent="center">
            {suggestions.map((suggestion) => (
              <Chips key={suggestion} color={props.color} onClick={props.onSend}>
                {suggestion}
              </Chips>
            ))}
          </Flex>
        </SuggestionsContainer>
      )}
      <InputContainer>
        {layout === PrototypeLayout.TEXT_DIALOG && (
          <>
            <UserInput testEnded={props.testEnded} value={input} onChange={onInputChange} />
            <ActionButtons {...props} />
          </>
        )}
        {layout === PrototypeLayout.VOICE_DIALOG && (
          <>
            {props.testEnded ? (
              <Flex flex={1}>
                <Text fontSize={15} color={theme.colors.tertiary}>
                  This conversation has ended
                </Text>
              </Flex>
            ) : (
              <SpeechBar onTranscript={onInputChange} locale={locale} className="share-prototype_speech-bar" />
            )}
            <ActionButtons {...props} noSend />
          </>
        )}
      </InputContainer>
    </Flex>
  );
};

export default ChatDialog;
