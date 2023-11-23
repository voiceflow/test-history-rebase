import { datadogRum } from '@datadog/browser-rum';
import { Button, FlexCenter, LOGROCKET_ENABLED, Upload } from '@voiceflow/ui';
import React from 'react';

import * as Account from '@/ducks/account';
import { useDispatch, useSelector } from '@/hooks';
import { OnboardingContext } from '@/pages/Onboarding/context';
import * as LogRocket from '@/vendors/logrocket';

import { FieldsContainer, Label, NameInput, ProfilePicUpload, UseCaseSelect } from '../components';
import { Container } from './components';

const JoinWorkspace: React.FC = () => {
  const user = useSelector(Account.userSelector);
  const updateUserProfileImage = useDispatch(Account.updateUserProfileImage);

  const { actions } = React.useContext(OnboardingContext);

  const [useCase, setUseCase] = React.useState('');
  const [userImage, setUserImage] = React.useState<string | null>('');
  const [name, setName] = React.useState(user.name || '');
  const canContinue = !!useCase && !!name;

  const onContinue = () => {
    actions.setPersonalizeWorkspaceMeta({ useCase });
    actions.finishJoiningWorkspace();
  };

  return (
    <Container>
      <FieldsContainer>
        <Label>Full Name</Label>
        <FlexCenter>
          <NameInput placeholder="Your name" value={name} onChange={(event) => setName(event.target.value)} />
          <Upload.Provider
            client={{ upload: (_endpoint, _fileType, formData) => updateUserProfileImage(formData) }}
            onError={(error) => {
              if (LOGROCKET_ENABLED) {
                LogRocket.error(error);
              } else {
                datadogRum.addError(error);
              }
            }}
          >
            <ProfilePicUpload image={userImage} update={setUserImage} />
          </Upload.Provider>
        </FlexCenter>
        <Label>What are you building?</Label>
        <UseCaseSelect useCase={useCase} setUseCase={setUseCase} />
      </FieldsContainer>
      <FlexCenter>
        <Button disabled={!canContinue} onClick={onContinue}>
          Join Workspace
        </Button>
      </FlexCenter>
    </Container>
  );
};

export default JoinWorkspace;
