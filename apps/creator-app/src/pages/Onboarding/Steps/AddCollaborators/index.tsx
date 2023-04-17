import { UserRole } from '@voiceflow/internal';
import { Badge, ClickableText, FlexCenter, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import ContinueButton from '@/pages/Onboarding/components/ContinueButton';
import { OnboardingContext } from '@/pages/Onboarding/context';
import { CollaboratorType, OnboardingStepProps } from '@/pages/Onboarding/types';

import { STEP_META, StepID } from '../../constants';
import { AddTeamMember, Container, HeaderLabel, Text } from './components';
import { getError, withPlaceholderCollaborators } from './utils';

const AddCollaborators: React.FC<OnboardingStepProps> = ({ data }) => {
  const {
    state: { addCollaboratorMeta, sendingRequests, justCreatingWorkspace, upgradingAWorkspace },
    actions: { setAddCollaboratorMeta, stepForward },
  } = React.useContext(OnboardingContext);
  const currentStepMeta = STEP_META[StepID.ADD_COLLABORATORS];

  const nextStepID = currentStepMeta.skipTo({
    justCreatingWorkspace,
    upgradingAWorkspace,
  });

  const [collaborators, setCollaborators] = React.useState(() =>
    withPlaceholderCollaborators(addCollaboratorMeta.collaborators.length ? addCollaboratorMeta.collaborators : data.collaborators)
  );
  const [errors, updateErrors] = React.useState<string[]>(() => collaborators.map(() => ''));

  const hasErrors = React.useMemo(() => errors.some(Boolean), [errors]);
  const validMembers = React.useMemo(
    () => collaborators.filter(({ email, permission }, index) => !!email && !errors[index] && permission !== UserRole.ADMIN),
    [errors, collaborators]
  );
  const disabledContinue = !validMembers.length || hasErrors || sendingRequests;

  const recalculateErrors = (members: CollaboratorType[]) => {
    const newErrors = members.map((member, index) => getError(members, member, index));
    if (newErrors.length) {
      updateErrors(newErrors);
    }
  };

  const onMemberUpdate = (members: CollaboratorType[]) => {
    recalculateErrors(members);
    setCollaborators(members);
  };

  const advanceToNextStep = () => {
    stepForward(nextStepID);
  };

  const onContinue = () => {
    setAddCollaboratorMeta({ collaborators: collaborators.filter(({ email }) => !!email) });
    advanceToNextStep();
  };

  React.useEffect(() => {
    recalculateErrors(collaborators);
  }, [collaborators.length]);

  return (
    <Container>
      <HeaderLabel>
        <Text>ADD COLLABORATORS</Text>
        <Badge>{validMembers.length}</Badge>
      </HeaderLabel>

      <AddTeamMember errors={errors} onUpdate={onMemberUpdate} collaborators={collaborators} />

      <FlexCenter column style={{ marginTop: '25px' }}>
        <ContinueButton disabled={disabledContinue} onClick={onContinue}>
          {sendingRequests ? <SvgIcon icon="arrowSpin" size={24} spin /> : 'Send Invites'}
        </ContinueButton>

        <ClickableText onClick={advanceToNextStep} mt={16}>
          Skip for now
        </ClickableText>
      </FlexCenter>
    </Container>
  );
};

export default AddCollaborators;
