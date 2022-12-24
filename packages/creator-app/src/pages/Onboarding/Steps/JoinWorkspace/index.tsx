import { Button, FlexCenter } from '@voiceflow/ui';
import React from 'react';

import * as Account from '@/ducks/account';
import { connect } from '@/hocs/connect';
import { OnboardingContext } from '@/pages/Onboarding/context';
import { ConnectedProps } from '@/types';

import { FieldsContainer, Label, NameInput, ProfilePicUpload, RoleSelect } from '../components';
import { Container } from './components';

const JoinWorkspace: React.FC<ConnectedJoinWorkspaceProps> = ({ user, saveProfilePicture }) => {
  const { actions } = React.useContext(OnboardingContext);

  const [userRole, setUserRole] = React.useState('');
  const [userImage, setUserImage] = React.useState<string | null>('');
  const [name, setName] = React.useState(user.name || '');
  const canContinue = !!userRole && !!name;

  const onContinue = () => {
    if (userImage) {
      saveProfilePicture(userImage);
    }

    actions.setJoinWorkspaceMeta({ role: userRole });
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

const mapStateToProps = {
  user: Account.userSelector,
};

const mapDispatchToProps = {
  saveProfilePicture: Account.saveProfilePicture,
};

export type ConnectedJoinWorkspaceProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(JoinWorkspace);
