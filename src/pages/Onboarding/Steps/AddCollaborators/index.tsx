import React from 'react';

import Badge from '@/components/Badge';
import Button from '@/components/Button';
import { FlexCenter } from '@/components/Flex';
import Icon from '@/components/SvgIcon';
import { useEnableDisable } from '@/hooks';
import { OnboardingContext } from '@/pages/Onboarding/context';
import { CollaboratorType, OnboardingProps } from '@/pages/Onboarding/types';

import StepID from '../../StepIDs';
import { AddTeamMember, BookDemo, Container, HeaderLabel, Text } from './components';

const AddCollaborators: React.FC<OnboardingProps> = ({ data }) => {
  const {
    state: { addCollaboratorMeta, sendingRequests },
    actions: { setAddCollaboratorMeta, stepForward },
  } = React.useContext(OnboardingContext);

  const [collaborators, setCollaborators] = React.useState(
    addCollaboratorMeta.collaborators.length ? addCollaboratorMeta.collaborators : data.collaborators
  );
  const [isDemoBooked, bookDemo, notBookDemo] = useEnableDisable(addCollaboratorMeta.isDemoBooked);
  const [errorIndexes, updateErrorIndexes] = React.useState<number[]>([]);
  const onMemberUpdate = (members: CollaboratorType[]) => {
    setCollaborators(members);

    // if no members except owner as collaborator
    if (members.length <= 1) {
      notBookDemo();
    }
  };

  const updateDemo = () => {
    if (isDemoBooked) {
      notBookDemo();
    } else {
      bookDemo();
    }
  };

  const onContinue = () => {
    setAddCollaboratorMeta({ collaborators, isDemoBooked });
    stepForward(StepID.PAYMENT);
  };

  return (
    <Container>
      <HeaderLabel>
        <Text>INVITE TEAM MEMBERS</Text>
        <Badge>{collaborators.length}</Badge>
      </HeaderLabel>
      <AddTeamMember errorIndexes={errorIndexes} updateErrorIndexes={updateErrorIndexes} onUpdate={onMemberUpdate} collaborators={collaborators} />
      <BookDemo checked={isDemoBooked} onChange={updateDemo} disabled={collaborators.length <= 1 || errorIndexes.length !== 0} />
      <FlexCenter>
        <Button disabled={errorIndexes.length !== 0 || sendingRequests} variant="primary" onClick={onContinue}>
          {sendingRequests ? <Icon icon="publishSpin" size={24} spin /> : 'Continue'}
        </Button>
      </FlexCenter>
    </Container>
  );
};

export default AddCollaborators;
