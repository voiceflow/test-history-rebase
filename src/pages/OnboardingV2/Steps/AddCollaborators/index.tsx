import React from 'react';

import Badge from '@/components/Badge';
import Button from '@/components/Button';
import { FlexCenter } from '@/components/Flex';
import { useEnableDisable } from '@/hooks';
import { StepID } from '@/pages/OnboardingV2/constants';
import { OnboardingContext } from '@/pages/OnboardingV2/context';
import { CollaboratorType, OnboardingProps } from '@/pages/OnboardingV2/types';

import { AddTeamMember, BookDemo, Container, HeaderLabel, Text } from './components';

const AddCollaborators: React.FC<OnboardingProps> = ({ data }) => {
  const {
    state: { addCollaboratorMeta },
    actions: { setAddCollaboratorMeta, stepForward },
  } = React.useContext(OnboardingContext);

  const [collaborators, setCollaborators] = React.useState(
    addCollaboratorMeta.collaborators.length ? addCollaboratorMeta.collaborators : data.collaborators
  );
  const [isDemoBooked, bookDemo, notBookDemo] = useEnableDisable(addCollaboratorMeta.isDemoBooked);
  const [isDisabledWithErrors, disableWithErrors, enableWithoutErrors] = useEnableDisable(false);

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
      <AddTeamMember
        onUpdate={onMemberUpdate}
        collaborators={collaborators}
        disableWithErrors={disableWithErrors}
        enableWithoutErrors={enableWithoutErrors}
      />
      <BookDemo checked={isDemoBooked} onChange={updateDemo} disabled={collaborators.length <= 1 || isDisabledWithErrors} />
      <FlexCenter>
        <Button onClick={onContinue} disabled={isDisabledWithErrors}>
          Continue
        </Button>
      </FlexCenter>
    </Container>
  );
};

export default AddCollaborators;
