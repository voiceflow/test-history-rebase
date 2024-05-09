import { ClickableText, FlexCenter, KeyName, toast, Upload, UploadIconVariant } from '@voiceflow/ui';
import React from 'react';

import ContinueButton from '../../components/ContinueButton';
import { OnboardingContext } from '../../context';
import { Container, LabelContainer, NameInput } from './components';

const CreateWorkspace: React.FC = () => {
  const { state, actions } = React.useContext(OnboardingContext);
  const { createWorkspaceMeta } = state;
  const { stepForward, setCreateWorkspaceMeta } = actions;
  const [workspaceName, setWorkspaceName] = React.useState(createWorkspaceMeta.workspaceName || '');
  const [workspaceImage, setWorkspaceImage] = React.useState<string | null>(createWorkspaceMeta.workspaceImage);
  const canContinue = !!workspaceName.trim() && workspaceName.length <= 32;
  const iconUploadRef = React.useRef<HTMLDivElement>(null);

  const onBlur = () => {
    if (workspaceName.length > 32) {
      toast.error('Workspace Name Too Long - 32 Characters Max');
    }
  };

  const onContinue = () => {
    setCreateWorkspaceMeta({ workspaceName, workspaceImage: workspaceImage ?? '' });
    stepForward(null);
  };

  const handleInputEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === KeyName.ENTER && canContinue) {
      onContinue();
    }
  };

  return (
    <Container>
      <FlexCenter>
        <NameInput
          value={workspaceName}
          onBlur={onBlur}
          autoFocus
          onKeyPress={handleInputEnterPress}
          placeholder="Give your workspace a name"
          onChangeText={setWorkspaceName}
        />
      </FlexCenter>

      <FlexCenter>
        <Upload.IconUpload image={workspaceImage} update={setWorkspaceImage} size={UploadIconVariant.LARGE} ref={iconUploadRef} />
      </FlexCenter>

      <LabelContainer>
        Drop workspace icon here <br />
        or <ClickableText onClick={() => iconUploadRef.current?.click()}>Browse</ClickableText> (optional)
      </LabelContainer>

      <FlexCenter>
        <ContinueButton disabled={!canContinue || state.sendingRequests} onClick={onContinue} isLoading={state.sendingRequests}>
          Continue
        </ContinueButton>
      </FlexCenter>
    </Container>
  );
};

export default CreateWorkspace;
