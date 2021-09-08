import { ClickableText, FlexCenter, KeyName } from '@voiceflow/ui';
import React from 'react';

import { UploadJustIcon } from '@/components/Upload/ImageUpload/IconUpload';
import ContinueButton from '@/pages/Onboarding/components/ContinueButton';
import { Container, LabelContainer, NameInput } from '@/pages/Onboarding/Steps/CreateWorkspace/components';
import { Identifier } from '@/styles/constants';

const IconUpload: React.FC<any> = UploadJustIcon;
interface NameAndImageProps {
  name: string;
  setName: (name: string) => void;
  projectImage: string;
  setProjectImage: (url: string) => void;
  onContinue: () => void;
}

const NameAndImage: React.FC<NameAndImageProps> = ({ name, setName, projectImage, setProjectImage, onContinue }) => {
  const canContinue = !!name;
  const iconUploadRef = React.createRef<HTMLElement>();
  const handleInputEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === KeyName.ENTER && canContinue) {
      onContinue();
    }
  };

  return (
    <Container id={Identifier.NEW_PROJECT_ICON_UPLOAD_CONTAINER}>
      <FlexCenter>
        <NameInput
          id={Identifier.NEW_PROJECT_NAME_INPUT}
          value={name}
          onKeyPress={handleInputEnterPress}
          onChange={(e: React.FormEvent<HTMLInputElement>) => setName(e.currentTarget.value)}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          placeholder="Name your project"
        />
      </FlexCenter>

      <FlexCenter>
        <IconUpload image={projectImage} update={setProjectImage} size="large" ref={iconUploadRef} endpoint="/image" />
      </FlexCenter>

      <LabelContainer>
        Drop project icon here <br />
        or <ClickableText onClick={() => iconUploadRef.current?.click()}>Browse</ClickableText> (optional)
      </LabelContainer>

      <FlexCenter>
        <ContinueButton disabled={!canContinue} onClick={onContinue}>
          Continue
        </ContinueButton>
      </FlexCenter>
    </Container>
  );
};

export default NameAndImage;
