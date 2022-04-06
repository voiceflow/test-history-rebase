import { Dropdown, IconButton, IconButtonVariant } from '@voiceflow/ui';
import React from 'react';

import Checkbox from '@/components/Checkbox';

import { Container, LabelContainer } from './components';

enum DialogLabel {
  DEBUG = 'Debug messages',
  INTENT_CONFIDENCE = 'Intent confidence',
}

interface DialogHeaderProps {
  showDebugs: boolean;
  isScrolling: boolean;
  toggleDebugs: VoidFunction;
  toggleIntentConf: VoidFunction;
  showIntentConfidence: boolean;
}

const DialogHeader: React.FC<DialogHeaderProps> = ({ showDebugs, showIntentConfidence, toggleDebugs, toggleIntentConf, isScrolling }) => {
  const renderLabel = (label: string, checked: boolean, onToggle: VoidFunction) => (
    <Checkbox checked={checked} onChange={onToggle}>
      <LabelContainer>{label}</LabelContainer>
    </Checkbox>
  );

  return (
    <Container hasShadow={isScrolling}>
      <b>Transcript</b>
      <Dropdown
        options={[
          { label: renderLabel(DialogLabel.INTENT_CONFIDENCE, showIntentConfidence, toggleIntentConf) },
          { label: renderLabel(DialogLabel.DEBUG, showDebugs, toggleDebugs) },
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
