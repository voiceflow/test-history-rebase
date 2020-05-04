import React from 'react';

import Badge from '@/components/Badge';
import Button from '@/components/Button';
import { FlexCenter } from '@/components/Flex';
import Icon from '@/components/SvgIcon';
import { useEnableDisable } from '@/hooks';
import { OnboardingContext } from '@/pages/OnboardingV2/context';
import { CollaboratorType, OnboardingProps } from '@/pages/OnboardingV2/types';

import StepID from '../../StepIDs';
import { AddTeamMember, BookDemo, Container, HeaderLabel, Text } from './components';

const AddCollaborators: React.FC<OnboardingProps> = ({ data }) => {
  const {
    state: { addCollaboratorMeta, stepStack, numberOfSteps, sendingRequests },
    actions: { setAddCollaboratorMeta, stepForward, finishCreateOnboarding },
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
    if (stepStack.length === numberOfSteps) {
      finishCreateOnboarding();
    } else {
      stepForward(StepID.PAYMENT);
    }
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
        <Button disabled={isDisabledWithErrors || sendingRequests} variant="primary" onClick={onContinue}>
          {sendingRequests ? <Icon icon="publishSpin" size={24} spin /> : 'Continue'}
        </Button>
      </FlexCenter>
    </Container>
  );
};

export default AddCollaborators;
