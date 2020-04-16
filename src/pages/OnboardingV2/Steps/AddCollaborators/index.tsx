import React from 'react';

import Button from '@/components/Button';
import { FlexCenter } from '@/components/Flex';
import { useEnableDisable } from '@/hooks';
import { StepID } from '@/pages/OnboardingV2/constants';
import { OnboardingContext } from '@/pages/OnboardingV2/context';
import { CollaboratorType, OnboardingProps } from '@/pages/OnboardingV2/types';

import { AddTeamMember, BookDemo, Container, Count, HeaderLabel } from './components';

const AddCollaborators: React.FC<OnboardingProps> = ({ data }) => {
  const {
    state: { addCollaboratorMeta },
    actions: { setAddCollaboratorMeta, stepForward },
  } = React.useContext(OnboardingContext);
  const [collaborators, setCollaborators] = React.useState([...addCollaboratorMeta.collaborators, data]);
  const [isDemoBooked, bookDemo, notBookDemo] = useEnableDisable(addCollaboratorMeta.isDemoBooked);
  const [isDisabled, disableContinue, enableContinue] = useEnableDisable(false);

  const onMemberUpdate = (members: CollaboratorType[]) => {
    setCollaborators(members);
    if (!members.length) {
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
        <span>INVITE TEAM MEMBERS</span>
        <Count>{collaborators.length}</Count>
      </HeaderLabel>

      <AddTeamMember onUpdate={onMemberUpdate} collaborators={collaborators} disableContinue={disableContinue} enableContinue={enableContinue} />

      <BookDemo checked={isDemoBooked} onChange={updateDemo} disabled={collaborators.length === 0} />

      <FlexCenter>
        <Button onClick={onContinue} disabled={isDisabled}>
          Continue
        </Button>
      </FlexCenter>
    </Container>
  );
};

export default AddCollaborators;
