import React, { useContext } from 'react';

import Button from '@/components/Button';
import { FlexCenter } from '@/components/Flex';
import { ClickableText } from '@/components/Text';
import { JustIconUpload } from '@/components/Upload/ImageUpload/IconUpload';
import { StepID } from '@/pages/OnboardingV2/constants';

import { OnboardingContext } from '../../context';
import { Container, LabelContainer, NameInput } from './components';

const IconUpload: any = JustIconUpload;

const CreateWorkspace: React.FC = () => {
  const { state, actions } = useContext(OnboardingContext);
  const { createWorkspaceMeta } = state;
  const { stepForward, setCreateWorkspaceMeta } = actions;
  const [workspaceName, setWorkspaceName] = React.useState<string>(createWorkspaceMeta.workspaceName || '');
  const [workspaceImage, setWorkspaceImage] = React.useState<string>(createWorkspaceMeta.workspaceImage || '');
  const canContinue = !!workspaceName.trim();
  const iconUploadRef: React.Ref<any> = React.createRef();
  const inputRef = React.createRef<HTMLElement>();

  React.useEffect(() => {
    inputRef?.current?.focus();
  });

  const onContinue = () => {
    setCreateWorkspaceMeta({
      workspaceName,
      workspaceImage,
    });
    stepForward(StepID.PERSONALIZE_WORKSPACE);
  };

  return (
    <Container>
      <NameInput
        value={workspaceName}
        onChange={(e: React.FormEvent<HTMLInputElement>) => setWorkspaceName(e.currentTarget.value)}
        placeholder="Enter your workspace name"
        ref={inputRef}
      />
      <FlexCenter>
        <IconUpload image={workspaceImage} update={setWorkspaceImage} size="large" ref={iconUploadRef} />
      </FlexCenter>
      <LabelContainer>
        Drop workspace icon here <br />
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

export default CreateWorkspace;
