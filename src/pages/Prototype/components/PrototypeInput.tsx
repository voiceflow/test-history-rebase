import React from 'react';

import { SectionToggleVariant, UncontrolledSection } from '@/components/Section';
import { BlockText } from '@/components/Text';
import TextArea from '@/components/TextArea';
import { useToggle } from '@/hooks/toggle';
import { Identifier } from '@/styles/constants';
import { preventDefault, withEnterPress } from '@/utils/dom';

import SpeechBar from './PrototypeSpeechBar';

export type PrototypeInputProps = {
  locale: string;
  disabled?: boolean;
  isPublic?: boolean;
  onUserInput: (input: string) => void;
};

const PrototypeInput: React.FC<PrototypeInputProps> = ({ locale, disabled, isPublic, onUserInput }) => {
  const [value, setValue] = React.useState('');
  const [collapsed, onCollapse] = useToggle(false);
  const [isListening, setListening] = React.useState(false);

  const collapsedBeforeListening = React.useRef(collapsed);

  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

  const onEnterPress = preventDefault(() => {
    if (!disabled) {
      onUserInput(value);
      setValue('');
    }
  });

  const onToggleListening = React.useCallback(
    (listening: boolean) => {
      onCollapse(listening || collapsedBeforeListening.current);
      setListening(listening);
      collapsedBeforeListening.current = collapsed;
    },
    [collapsed]
  );

  return (
    <>
      <UncontrolledSection
        header={isListening ? 'Listening...' : 'User Says'}
        onClick={isListening ? null : onCollapse}
        isCollapsed={collapsed}
        collapseVariant={SectionToggleVariant.ARROW}
      >
        <TextArea
          id={Identifier.PROTOTYPE_RESPONSE}
          value={value}
          minRows={3}
          onChange={(e) => setValue(e.target.value)}
          inputRef={textAreaRef}
          autoFocus // eslint-disable-line jsx-a11y/no-autofocus
          onKeyPress={withEnterPress(onEnterPress)}
          placeholder="Enter Response"
        />
        <BlockText color="tertiary" fontSize="s" mt="s" mb="xl">
          Press 'Enter' to send
        </BlockText>
      </UncontrolledSection>

      <SpeechBar locale={locale} isPublic={isPublic} onTranscript={onUserInput} onToggleListening={onToggleListening} />
    </>
  );
};

export default PrototypeInput;
