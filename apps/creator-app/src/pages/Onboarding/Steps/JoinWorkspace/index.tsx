import { datadogRum } from '@datadog/browser-rum';
import { Button, FlexCenter, Upload } from '@voiceflow/ui';
import React from 'react';

import * as Account from '@/ducks/account';
import { useDispatch, useSelector } from '@/hooks';
import { OnboardingContext } from '@/pages/Onboarding/context';

import { FieldsContainer, Label, NameInput, ProfilePicUpload, RoleSelect } from '../components';
import { Container } from './components';

const JoinWorkspace: React.FC = () => {
  const user = useSelector(Account.userSelector);
  const updateUserProfileImage = useDispatch(Account.updateUserProfileImage);

  const { actions } = React.useContext(OnboardingContext);

  const [userRole, setUserRole] = React.useState('');
  const [userImage, setUserImage] = React.useState<string | null>('');
  const [name, setName] = React.useState(user.name || '');
  const canContinue = !!userRole && !!name;

  const onContinue = () => {
    actions.setPersonalizeWorkspaceMeta({ role: userRole });
    actions.finishJoiningWorkspace();
  };

  return (
    <Container>
      <FieldsContainer>
        <Label>Full Name</Label>
        <FlexCenter>
          <NameInput placeholder="Your name" value={name} onChange={(event) => setName(event.target.value)} />
          <Upload.Provider client={{ upload: (_endpoint, _fileType, formData) => updateUserProfileImage(formData) }} onError={datadogRum.addError}>
            <ProfilePicUpload image={userImage} update={setUserImage} />
          </Upload.Provider>
        </FlexCenter>
        <Label>Choose your role</Label>
        <RoleSelect userRole={userRole} setUserRole={setUserRole} />
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
