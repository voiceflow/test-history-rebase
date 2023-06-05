import { Box, Button, Input, Modal, SectionV2, Upload, UploadIconVariant, useLinkedState } from '@voiceflow/ui';
import React from 'react';

interface NameProps {
  name: string;
  image: string | null;
  onNext: (options: { name: string; image: string | null }) => void;
  onClose: VoidFunction;
}

const Name: React.FC<NameProps> = ({ name: nameProp, image: imageProp, onNext: onNextProp }) => {
  const [name, setName] = useLinkedState(nameProp);
  const [image, setImage] = useLinkedState<string | null>(imageProp);

  const onNext = () => {
    if (!name) return;

    onNextProp({ name, image });
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
          contentProps={{ px: 0, bottomOffset: 2.5 }}
        >
          <Box.Flex gap={12}>
            <Input autoFocus value={name} placeholder="Enter assistant name" onChangeText={setName} />

            <Upload.IconUpload size={UploadIconVariant.EXTRA_SMALL} image={image} update={setImage} isSquare />
          </Box.Flex>
        </SectionV2.SimpleContentSection>

        <Button onClick={onNext} disabled={!name} fullWidth>
          Continue
        </Button>
      </Modal.Body>
    </>
  );
};

export default Name;
