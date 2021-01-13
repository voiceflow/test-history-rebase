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
  smallIcon: string;
  largeIcon: string;
  onContinue: () => void;
  setSmallIcon: (url: string) => void;
  setLargeIcon: (url: string) => void;
};

const NameAndImage: React.FC<NameAndImageProps> = ({ name, setName, largeIcon, setSmallIcon, setLargeIcon, onContinue }) => {
  const canContinue = !!name;
  const iconUploadRef = React.createRef<HTMLElement>();

  const updateIconURLS = (urls: string[]) => {
    setLargeIcon(urls[0]);
    setSmallIcon(urls[1]);
  };

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
        <IconUpload
          image={largeIcon}
          update={updateIconURLS}
          size="large"
          ref={iconUploadRef}
          endpoint={['/image/large_icon', '/image/small_icon']}
        />
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
