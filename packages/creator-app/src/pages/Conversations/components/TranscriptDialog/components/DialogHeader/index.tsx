import { Dropdown, IconButton, IconButtonVariant } from '@voiceflow/ui';
import React from 'react';

import Checkbox from '@/components/Checkbox';

import { Container, LabelContainer } from './components';

enum DialogLabel {
  INTENT_CONFIDENCE = 'Intent confidence',
  DEBUG = 'Debug messages',
}

interface DialogHeaderProps {
  isScrolling: boolean;
  toggleDebugs: () => void;
  toggleIntentConf: () => void;
  showDebugs: boolean;
  showIntentConfidence: boolean;
}

const DialogHeader: React.FC<DialogHeaderProps> = ({ showDebugs, showIntentConfidence, toggleDebugs, toggleIntentConf, isScrolling }) => {
  const onToggle = (isDebugMessage: boolean) => {
    isDebugMessage ? toggleDebugs() : toggleIntentConf();
  };

  const Label = (label: string, checked: boolean) => {
    return (
      <Checkbox
        checked={checked}
        onChange={() => {
          label === DialogLabel.DEBUG ? onToggle(true) : onToggle(false);
        }}
      >
        <LabelContainer>{label}</LabelContainer>
      </Checkbox>
    );
  };

  return (
    <Container hasShadow={isScrolling}>
      <b>Transcript</b>
      <Dropdown
        options={[
          {
            label: Label(DialogLabel.INTENT_CONFIDENCE, showIntentConfidence),
          },
          {
            label: Label(DialogLabel.DEBUG, showDebugs),
          },
        ]}
        placement="bottom-end"
      >
        {(ref, onToggle, isOpen) => (
          <IconButton active={isOpen} icon="ellipsis" variant={IconButtonVariant.SUBTLE} size={15} onClick={onToggle} ref={ref} />
        )}
      </Dropdown>
    </Container>
  );
};
export default DialogHeader;
