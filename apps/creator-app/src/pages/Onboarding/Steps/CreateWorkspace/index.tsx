import { ClickableText, FlexCenter, KeyName, toast, Upload, UploadIconVariant } from '@voiceflow/ui';
import React from 'react';

import ContinueButton from '../../components/ContinueButton';
import { useOnboardingContext } from '../../context';
import * as S from './styles';

const OnboardingStepsCreateWorkspace: React.FC = () => {
  const {
    state: { createWorkspaceMeta, sendingRequests },
    stateAPI,
    stepForward,
  } = useOnboardingContext();
  const canContinue = !!createWorkspaceMeta.workspaceName.trim() && createWorkspaceMeta.workspaceName.length <= 32;
  const iconUploadRef = React.useRef<HTMLDivElement>(null);

  const onBlur = () => {
    if (createWorkspaceMeta.workspaceName.length > 32) {
      toast.error('Workspace Name Too Long - 32 Characters Max');
    }
  };

  const handleInputEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === KeyName.ENTER && canContinue) {
      stepForward();
    }
  };

  return (
    <S.Container>
      <FlexCenter>
        <S.WorkspaceNameInput
          value={createWorkspaceMeta.workspaceName}
          onBlur={onBlur}
          autoFocus
          onKeyPress={handleInputEnterPress}
          placeholder="Give your workspace a name"
          onChangeText={(value) => stateAPI.createWorkspaceMeta.update({ workspaceName: value })}
        />
      </FlexCenter>

      <FlexCenter>
        <Upload.IconUpload
          image={createWorkspaceMeta.workspaceImage}
          update={(value) => stateAPI.createWorkspaceMeta.update({ workspaceImage: value ?? '' })}
          size={UploadIconVariant.LARGE}
          ref={iconUploadRef}
        />
      </FlexCenter>

      <S.LabelContainer>
        Drop workspace icon here <br />
        or <ClickableText onClick={() => iconUploadRef.current?.click()}>Browse</ClickableText> (optional)
      </S.LabelContainer>

      <FlexCenter>
        <ContinueButton
          disabled={!canContinue || sendingRequests}
          onClick={() => stepForward()}
          isLoading={sendingRequests}
        >
          Continue
        </ContinueButton>
      </FlexCenter>
    </S.Container>
  );
};

export default OnboardingStepsCreateWorkspace;
