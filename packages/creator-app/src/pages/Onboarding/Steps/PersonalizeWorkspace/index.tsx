import { FlexCenter, Input } from '@voiceflow/ui';
import React, { useContext } from 'react';

import RadioGroup from '@/components/RadioGroup';
import ContinueButton from '@/pages/Onboarding/components/ContinueButton';

import { CREATING_FOR_OPTIONS, getCreatingForProjectType, StepID } from '../../constants';
import { OnboardingContext } from '../../context';
import { PersonalizeWorkspaceMeta } from '../../context/types';
import { CreatingForType } from '../../types';
import { Label, RoleSelect } from '../components';
import { Container, SizeButton, SizeRow, TeamSizeContainer } from './components';

const TEAM_SIZES = ['Only Me', '2 - 3', '4 - 6', '7 - 10', '11 - 20', '20 +'];

const PersonalizeWorkspace: React.OldFC = () => {
  const { state, actions } = useContext(OnboardingContext);
  const [userRole, setUserRole] = React.useState(state.personalizeWorkspaceMeta.role || '');
  const [company, setCompany] = React.useState(state.personalizeWorkspaceMeta.company || '');
  const [teamSize, setTeamSize] = React.useState(state.personalizeWorkspaceMeta.teamSize || '');
  const [creatingFor, setCreatingFor] = React.useState<CreatingForType>(CreatingForType.CHAT);
  const canContinue = !!userRole && !!teamSize;

  const onContinue = () => {
    const workspaceMeta: PersonalizeWorkspaceMeta = {
      role: userRole,
      company,
      teamSize,
    };

    workspaceMeta.projectType = getCreatingForProjectType[creatingFor];

    actions.setPersonalizeWorkspaceMeta(workspaceMeta);
    actions.stepForward(StepID.CREATE_WORKSPACE);
  };

  return (
    <Container>
      <Label>Company Name</Label>
      <Input placeholder="Enter company name" value={company} onChangeText={setCompany} />
      <Label>Choose your role</Label>
      <RoleSelect userRole={userRole} setUserRole={setUserRole} />
      <Label>What are you creating for?</Label>
      <RadioGroup isFlat options={CREATING_FOR_OPTIONS} checked={creatingFor} onChange={setCreatingFor} />

      <Label>How big is your team?</Label>
      <TeamSizeContainer>
        <SizeRow>
          {TEAM_SIZES.map((size, index) => (
            <SizeButton onClick={() => setTeamSize(size)} selected={teamSize === size} key={index}>
              {size}
            </SizeButton>
          ))}
        </SizeRow>
      </TeamSizeContainer>
      <FlexCenter>
        <ContinueButton disabled={!canContinue} onClick={onContinue}>
          Continue
        </ContinueButton>
      </FlexCenter>
    </Container>
  );
};

export default PersonalizeWorkspace;
