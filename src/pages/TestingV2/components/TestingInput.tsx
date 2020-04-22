import React from 'react';

import { SectionToggleVariant, UncontrolledSection } from '@/components/Section';
import TextArea from '@/components/TextArea';
import { useToggle } from '@/hooks/toggle';
import { preventDefault, withEnterPress } from '@/utils/dom';

import SpeechBar from './TestingSpeechBar';

export type TestingInputProps = {
  locale: string;
  disabled?: boolean;
  isPublic?: boolean;
  forceFocus?: boolean;
  onUserInput: (input: string) => void;
};

const TestingInput: React.FC<TestingInputProps> = ({ locale, disabled, forceFocus, isPublic, onUserInput }) => {
  const [value, setValue] = React.useState('');
  const [collapsed, onCollapse] = useToggle(false);
  const [isListening, setListening] = React.useState(false);

  const collapsedBeforeListening = React.useRef(collapsed);

  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

  const onEnterPress = preventDefault(() => {
    onUserInput(value);
    setValue('');
  });

  const onToggleListening = React.useCallback(
    (listening: boolean) => {
      onCollapse(listening || collapsedBeforeListening.current);
      setListening(listening);
      collapsedBeforeListening.current = collapsed;
    },
    [collapsed]
  );

  React.useEffect(() => {
    if (forceFocus) {
      textAreaRef.current?.focus();
    }
  }, [forceFocus]);

  return (
    <>
      <UncontrolledSection
        header={isListening ? 'Listening...' : 'User Says'}
        onClick={isListening ? null : onCollapse}
        isCollapsed={collapsed}
        collapseVariant={SectionToggleVariant.ARROW}
      >
        <TextArea
          value={value}
          minRows={2}
          onChange={(e) => setValue(e.target.value)}
          disabled={disabled}
          inputRef={textAreaRef}
          autoFocus={forceFocus} // eslint-disable-line jsx-a11y/no-autofocus
          onKeyPress={withEnterPress(onEnterPress)}
          placeholder="Enter Response"
        />
        <p>'Press Enter to send'</p>
      </UncontrolledSection>

      <SpeechBar locale={locale} isPublic={isPublic} onTranscript={onUserInput} onToggleListening={onToggleListening} />
    </>
  );
};

export default TestingInput;
