import React from 'react';

import Button from '@/components/Button';
import { FlexCenter } from '@/components/Flex';
import { ClickableText } from '@/components/Text';
import { UploadJustIcon } from '@/components/Upload/ImageUpload/IconUpload';
import { Container, LabelContainer, NameInput } from '@/pages/Onboarding/Steps/CreateWorkspace/components';

const IconUpload: React.FC<any> = UploadJustIcon;
type NameAndImageProps = {
  name: string;
  setName: (name: string) => void;
  image: string;
  setImage: (url: string) => void;
  onContinue: () => void;
};

const NameAndImage: React.FC<NameAndImageProps> = ({ name, setName, image, setImage, onContinue }) => {
  const canContinue = !!name;
  const iconUploadRef = React.createRef<HTMLElement>();

  return (
    <Container>
      <FlexCenter>
        <NameInput
          value={name}
          onChange={(e: React.FormEvent<HTMLInputElement>) => setName(e.currentTarget.value)}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          placeholder="Name your project"
        />
      </FlexCenter>

      <FlexCenter>
        <IconUpload image={image} update={setImage} size="large" ref={iconUploadRef} />
      </FlexCenter>

      <LabelContainer>
        Drop project icon here <br />
        or <ClickableText onClick={() => iconUploadRef.current?.click()}>Browse</ClickableText> (optional)
      </LabelContainer>

      <FlexCenter>
        <Button disabled={!canContinue} variant="primary" onClick={onContinue}>
          Continue
        </Button>
      </FlexCenter>
    </Container>
  );
};

export default NameAndImage;
