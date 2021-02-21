import React from 'react';

import Badge from '@/components/Badge';
import Button from '@/components/Button';
import { FlexCenter } from '@/components/Flex';
import Icon from '@/components/SvgIcon';
import { ClickableText } from '@/components/Text';
import { FeatureFlag } from '@/config/features';
import { UserRole } from '@/constants';
import { useFeature } from '@/hooks';
import { OnboardingContext } from '@/pages/Onboarding/context';
import { CollaboratorType, OnboardingProps } from '@/pages/Onboarding/types';

import { StepID } from '../../constants';
import { AddTeamMember, Container, HeaderLabel, Text } from './components';
import { getError, withPlaceholderCollaborators } from './utils';

const AddCollaborators: React.FC<OnboardingProps> = ({ data }) => {
  const {
    state: { addCollaboratorMeta, sendingRequests, justCreatingWorkspace },
    actions: { setAddCollaboratorMeta, stepForward },
  } = React.useContext(OnboardingContext);
  const platformOnboarding = useFeature(FeatureFlag.PLATFORM_ONBOARDING);

  const [collaborators, setCollaborators] = React.useState(() =>
    withPlaceholderCollaborators(addCollaboratorMeta.collaborators.length ? addCollaboratorMeta.collaborators : data.collaborators)
  );
  const [errors, updateErrors] = React.useState<string[]>(() => collaborators.map(() => ''));

  const hasErrors = React.useMemo(() => errors.some(Boolean), [errors]);
  const validMembers = React.useMemo(
    () => collaborators.filter(({ email, permission }, index) => !!email && !errors[index] && permission !== UserRole.ADMIN),
    [errors, collaborators]
  );

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

  const advanceToNextStep = () =>
    justCreatingWorkspace || !platformOnboarding.isEnabled ? stepForward(StepID.PAYMENT) : stepForward(StepID.SELECT_CHANNEL);

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
        <Button disabled={!validMembers.length || hasErrors || sendingRequests} variant="primary" onClick={onContinue}>
          {sendingRequests ? <Icon icon="publishSpin" size={24} spin /> : 'Send Invites'}
        </Button>

        <ClickableText onClick={advanceToNextStep} mt={16}>
          Skip for now
        </ClickableText>
      </FlexCenter>
    </Container>
  );
};

export default AddCollaborators;
