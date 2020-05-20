import React from 'react';

import Button from '@/components/Button';
import { FlexCenter } from '@/components/Flex';
import { ClickableText } from '@/components/Text';
import { toast } from '@/components/Toast';
import { UploadJustIcon } from '@/components/Upload/ImageUpload/IconUpload';

import { StepID } from '../../constants';
import { OnboardingContext } from '../../context';
import { Container, LabelContainer, NameInput } from './components';

const IconUpload: React.FC<any> = UploadJustIcon;

const CreateWorkspace: React.FC = () => {
  const { state, actions } = React.useContext(OnboardingContext);
  const { createWorkspaceMeta } = state;
  const { stepForward, setCreateWorkspaceMeta } = actions;
  const [workspaceName, setWorkspaceName] = React.useState<string>(createWorkspaceMeta.workspaceName || '');
  const [workspaceImage, setWorkspaceImage] = React.useState<string>(createWorkspaceMeta.workspaceImage || '');
  const canContinue = !!workspaceName.trim() && workspaceName.length <= 32;
  const iconUploadRef = React.createRef<HTMLElement>();

  const onBlur = () => {
    if (workspaceName.length > 32) {
      toast.error('Workspace Name Too Long - 32 Characters Max');
    }
  };

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
        onBlur={onBlur}
        onChange={(e: React.FormEvent<HTMLInputElement>) => setWorkspaceName(e.currentTarget.value)}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        placeholder="Enter your workspace name"
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
