import React from 'react';

import Button from '@/components/Button';
import { FlexCenter } from '@/components/Flex';
import * as Account from '@/ducks/account';
import { connect } from '@/hocs';
import { OnboardingContext } from '@/pages/Onboarding/context';
import { ConnectedProps } from '@/types';

import { FieldsContainer, Label, NameInput, ProfilePicUpload, RoleSelect } from '../components';
import { Container } from './components';

const JoinWorkspace: React.FC<ConnectedJoinWorkspaceProps> = ({ updateAccount }) => {
  const { actions } = React.useContext(OnboardingContext);

  const [userRole, setUserRole] = React.useState('');
  const [userImage, setUserImage] = React.useState('');
  const [name, setName] = React.useState('');
  const canContinue = !!userRole && !!name;

  const onContinue = () => {
    if (userImage) {
      updateAccount({ image: userImage });
    }
    actions.setJoinWorkspaceMeta({ role: userRole });
    actions.finishJoiningWorkspace();
  };

  return (
    <Container>
      <FieldsContainer>
        <Label>Full Name</Label>
        <div>
          <NameInput placeholder="Your name" value={name} onChange={(e: any) => setName(e.target.value)} />
          <ProfilePicUpload
            image={userImage}
            update={(url: string) => {
              setUserImage(url);
            }}
            size="xsmall"
          />
        </div>
        <Label>Choose your role</Label>
        <RoleSelect userRole={userRole} setUserRole={setUserRole} />
      </FieldsContainer>
      <FlexCenter>
        <Button disabled={!canContinue} variant="primary" onClick={onContinue}>
          Join Workspace
        </Button>
      </FlexCenter>
    </Container>
  );
};

const mapDispatchToProps = {
  updateAccount: Account.updateAccount,
};

export type ConnectedJoinWorkspaceProps = ConnectedProps<{}, typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(JoinWorkspace);
