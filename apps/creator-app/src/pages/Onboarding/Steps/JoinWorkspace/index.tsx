import { datadogRum } from '@datadog/browser-rum';
import { Button, FlexCenter, Upload } from '@voiceflow/ui';
import React from 'react';

import * as Account from '@/ducks/account';
import { useDispatch, useSelector } from '@/hooks';

import { useOnboardingContext } from '../../context';
import UseCaseSelect from '../../UseCaseSelect';
import { FieldsContainer, Label, NameInput, ProfilePicUpload } from '../styles';
import * as S from './styles';

const OnboardingStepsJoinWorkspace: React.FC = () => {
  const user = useSelector(Account.userSelector);
  const updateUserProfileImage = useDispatch(Account.updateUserProfileImage);
  const updateUserProfileName = useDispatch(Account.updateUserProfileName);

  const {
    state: { personalizeWorkspaceMeta, sendingRequests },
    stateAPI,
    stepForward,
  } = useOnboardingContext();
  const { useCase } = personalizeWorkspaceMeta;
  const [userImage, setUserImage] = React.useState<string | null>('');
  const [name, setName] = React.useState(user.name || '');
  const canContinue = !!useCase && !!name;

  const onContinue = async () => {
    if (name !== user.name) {
      await updateUserProfileName(name);
    }
    stepForward();
  };

  return (
    <S.Container>
      <FieldsContainer>
        <Label>Full Name</Label>
        <FlexCenter>
          <NameInput placeholder="Your name" value={name} onChange={(event) => setName(event.target.value)} />
          <Upload.Provider
            client={{ upload: (_endpoint, _fileType, formData) => updateUserProfileImage(formData) }}
            onError={datadogRum.addError}
          >
            <ProfilePicUpload image={userImage} update={setUserImage} />
          </Upload.Provider>
        </FlexCenter>
        <Label>What are you building?</Label>
        <UseCaseSelect
          useCase={useCase}
          setUseCase={(value) => stateAPI.personalizeWorkspaceMeta.update({ useCase: value })}
        />
      </FieldsContainer>
      <FlexCenter>
        <Button disabled={!canContinue || sendingRequests} isLoading={sendingRequests} width={152} onClick={onContinue}>
          Join Workspace
        </Button>
      </FlexCenter>
    </S.Container>
  );
};

export default OnboardingStepsJoinWorkspace;
