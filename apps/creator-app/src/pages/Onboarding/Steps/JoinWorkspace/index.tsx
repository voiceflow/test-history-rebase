import { Button, FlexCenter } from '@voiceflow/ui';
import React from 'react';

import * as Account from '@/ducks/account';
import { useDispatch, useSelector } from '@/hooks';
import { OnboardingContext } from '@/pages/Onboarding/context';

import { FieldsContainer, Label, NameInput, ProfilePicUpload, RoleSelect } from '../components';
import { Container } from './components';

const JoinWorkspace: React.FC = () => {
  const user = useSelector(Account.userSelector);
  const saveProfilePicture = useDispatch(Account.saveProfilePicture);

  const { actions } = React.useContext(OnboardingContext);

  const [userRole, setUserRole] = React.useState('');
  const [userImage, setUserImage] = React.useState<string | null>('');
  const [name, setName] = React.useState(user.name || '');
  const canContinue = !!userRole && !!name;

  const onContinue = () => {
    if (userImage) {
      saveProfilePicture(userImage);
    }

    actions.setPersonalizeWorkspaceMeta({ role: userRole });
    actions.finishJoiningWorkspace();
  };

  return (
    <Container>
      <FieldsContainer>
        <Label>Full Name</Label>
        <FlexCenter>
          <NameInput placeholder="Your name" value={name} onChange={(event) => setName(event.target.value)} />
          <ProfilePicUpload image={userImage} update={setUserImage} />
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
