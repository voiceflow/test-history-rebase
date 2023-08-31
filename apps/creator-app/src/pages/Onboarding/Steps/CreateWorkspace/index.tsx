import { datadogRum } from '@datadog/browser-rum';
import { ClickableText, FlexCenter, KeyName, toast, Upload, UploadIconVariant } from '@voiceflow/ui';
import React from 'react';

import * as Workspace from '@/ducks/workspaceV2';
import { useDispatch } from '@/hooks';

import ContinueButton from '../../components/ContinueButton';
import { StepID } from '../../constants';
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

  const updateActiveWorkspaceImage = useDispatch(Workspace.updateActiveWorkspaceImage);

  const onBlur = () => {
    if (workspaceName.length > 32) {
      toast.error('Workspace Name Too Long - 32 Characters Max');
    }
  };

  const onContinue = () => {
    setCreateWorkspaceMeta({ workspaceName, workspaceImage: workspaceImage ?? '' });
    stepForward(StepID.ADD_COLLABORATORS);
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
        {state.usedSignupCoupon ? (
          <Upload.Provider
            client={{ upload: (_endpoint, _fileType, formData) => updateActiveWorkspaceImage(formData) }}
            onError={datadogRum.addError}
          >
            <Upload.IconUpload image={workspaceImage} update={setWorkspaceImage} size={UploadIconVariant.LARGE} ref={iconUploadRef} />
          </Upload.Provider>
        ) : (
          <Upload.IconUpload image={workspaceImage} update={setWorkspaceImage} size={UploadIconVariant.LARGE} ref={iconUploadRef} />
        )}
      </FlexCenter>

      <LabelContainer>
        Drop workspace icon here <br />
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

export default CreateWorkspace;
