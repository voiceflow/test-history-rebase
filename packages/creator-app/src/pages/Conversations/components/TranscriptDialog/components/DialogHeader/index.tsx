import { Dropdown, IconButton, IconButtonVariant } from '@voiceflow/ui';
import React from 'react';

import Checkbox from '@/components/Checkbox';

import { Container, LabelContainer } from './components';

interface TranscriptDialogInformation {
  intentConfidenceToggled: boolean;
  debugMessageToggled: boolean;
}

interface DialogHeaderProps {
  transcriptInformation: TranscriptDialogInformation;
  handleChange: (isDebugToggled: boolean) => void;
}

const Label = (label: string, checked: boolean) => {
  return (
    <Checkbox checked={checked}>
      <LabelContainer>{label}</LabelContainer>
    </Checkbox>
  );
};

const DialogHeader: React.FC<DialogHeaderProps> = ({ transcriptInformation, handleChange }) => {
  const [intentConfidenceToggled, setIntentConfidenceToggled] = React.useState<boolean>(transcriptInformation.intentConfidenceToggled);
  const [debugMessageToggled, setDebugMessageToggled] = React.useState<boolean>(transcriptInformation.debugMessageToggled);

  const onToggle = (isDebugMessage: boolean) => {
    isDebugMessage ? setDebugMessageToggled(!debugMessageToggled) : setIntentConfidenceToggled(!intentConfidenceToggled);

    handleChange(isDebugMessage);
  };

  return (
    <Container>
      <b>Transcript</b>
      <Dropdown
        selfDismiss
        options={[
          {
            label: Label('Intent confidence', intentConfidenceToggled),
            onClick: () => onToggle(false),
          },
          {
            label: Label('Debug messages', debugMessageToggled),
            onClick: () => onToggle(true),
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
