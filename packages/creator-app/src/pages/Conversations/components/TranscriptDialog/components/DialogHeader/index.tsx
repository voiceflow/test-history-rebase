import { Dropdown, IconButton, IconButtonVariant } from '@voiceflow/ui';
import React from 'react';

import Checkbox from '@/components/Checkbox';

import { Container, LabelContainer } from './components';

enum DialogLabel {
  INTENT_CONFIDENCE = 'Intent confidence',
  DEBUG = 'Debug messages',
}
interface TranscriptDialogInformation {
  intentConfidenceToggled: boolean;
  debugMessageToggled: boolean;
}

interface DialogHeaderProps {
  transcriptInformation: TranscriptDialogInformation;
  handleChange: (isDebugToggled: boolean) => void;
  isScrolling: boolean;
}

const DialogHeader: React.FC<DialogHeaderProps> = ({ transcriptInformation, handleChange, isScrolling }) => {
  const [intentConfidenceToggled, setIntentConfidenceToggled] = React.useState<boolean>(transcriptInformation.intentConfidenceToggled);
  const [debugMessageToggled, setDebugMessageToggled] = React.useState<boolean>(transcriptInformation.debugMessageToggled);

  const onToggle = (isDebugMessage: boolean) => {
    isDebugMessage ? setDebugMessageToggled(!debugMessageToggled) : setIntentConfidenceToggled(!intentConfidenceToggled);

    handleChange(isDebugMessage);
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
        selfDismiss
        options={[
          {
            label: Label(DialogLabel.INTENT_CONFIDENCE, intentConfidenceToggled),
          },
          {
            label: Label(DialogLabel.DEBUG, debugMessageToggled),
          },
        ]}
        placement="bottom-end"
      >
        {(ref, onToggle) => <IconButton icon="ellipsis" variant={IconButtonVariant.SUBTLE} size={15} onClick={onToggle} ref={ref} />}
      </Dropdown>
    </Container>
  );
};
export default DialogHeader;
