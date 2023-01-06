import { Badge, Box, Button, Input, Modal, SectionV2, Upload, UploadIconVariant, useLinkedState } from '@voiceflow/ui';
import React from 'react';

import { Screen } from '../../constants';
import { Card } from './components';
import { NLU_BUBBLES, PLATFORM_BUBBLES } from './constants';

interface ChooseTypeProps {
  name: string;
  image: string | null;
  onNext: (options: { name: string; image: string | null; screen: Screen.NLU_SETUP | Screen.PLATFORM_SETUP }) => void;
  screen: Screen.NLU_SETUP | Screen.PLATFORM_SETUP | null;
  onClose: VoidFunction;
}

const ChooseType: React.OldFC<ChooseTypeProps> = ({ name: nameProp, image: imageProp, onNext: onNextProp, screen: screenProp }) => {
  const [name, setName] = useLinkedState(nameProp);
  const [image, setImage] = useLinkedState<string | null>(imageProp);
  const [screen, setScreen] = useLinkedState(screenProp);

  const onNext = () => {
    if (!name || !screen) return;

    onNextProp({ name, image, screen });
  };

  return (
    <>
      <Modal.Body>
        <SectionV2.SimpleContentSection
          header={
            <SectionV2.Title bold secondary>
              Name
            </SectionV2.Title>
          }
          headerProps={{ px: 0, bottomUnit: 1.5 }}
          contentProps={{ px: 0, bottomOffset: 0 }}
        >
          <Box.Flex gap={12}>
            <Input value={name} placeholder="Enter assistant name" onChangeText={setName} />

            <Upload.IconUpload size={UploadIconVariant.EXTRA_SMALL} image={image} update={setImage} isSquare />
          </Box.Flex>
        </SectionV2.SimpleContentSection>

        <SectionV2.SimpleContentSection
          header={
            <SectionV2.Title bold secondary>
              Choose a type
            </SectionV2.Title>
          }
          headerProps={{ px: 0, bottomUnit: 1.5 }}
          contentProps={{ px: 0, bottomOffset: 3 }}
        >
          <Box.Flex gap={12} column>
            <Card
              title="Launch & Host"
              badge={<Badge.Descriptive>New</Badge.Descriptive>}
              onClick={() => setScreen(Screen.PLATFORM_SETUP)}
              onDoubleClick={() => onNext()}
              bubbles={PLATFORM_BUBBLES}
              isActive={screen === Screen.PLATFORM_SETUP}
              description="Design, prototype and launch your assistant on chat and voice channels."
            />

            <Card
              title="Design & Handoff"
              bubbles={NLU_BUBBLES}
              onClick={() => setScreen(Screen.NLU_SETUP)}
              onDoubleClick={() => onNext()}
              isActive={screen === Screen.NLU_SETUP}
              description="Design, prototype and handoff your assistant to your technology vendor."
            />
          </Box.Flex>
        </SectionV2.SimpleContentSection>

        <Button onClick={onNext} disabled={!name || !screen} fullWidth>
          Continue
        </Button>
      </Modal.Body>
    </>
  );
};

export default ChooseType;
