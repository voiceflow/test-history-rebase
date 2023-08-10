import { Utils } from '@voiceflow/common';
import { Box, Input, Select } from '@voiceflow/ui';
import React, { useContext } from 'react';

import RadioGroup from '@/components/RadioGroup';
import ContinueButton from '@/pages/Onboarding/components/ContinueButton';

import { CREATING_FOR_OPTIONS, getCreatingForProjectType, StepID, TEAM_GOAL_OPTIONS, TEAM_SIZE_OPTIONS } from '../../constants';
import { OnboardingContext } from '../../context';
import { PersonalizeWorkspaceMeta } from '../../context/types';
import { CreatingForType, TeamGoalType, TeamSizeType } from '../../types';
import { Label, RoleSelect } from '../components';
import * as S from './styles';

const PersonalizeWorkspace: React.FC = () => {
  const { state, actions } = useContext(OnboardingContext);
  const [userRole, setUserRole] = React.useState(state.personalizeWorkspaceMeta.role || '');
  const [company, setCompany] = React.useState(state.personalizeWorkspaceMeta.company || '');
  const [selfReportedAttribution, setSelfReportedAttribution] = React.useState('');
  const [teamSize, setTeamSize] = React.useState<TeamSizeType>();
  const [creatingFor, setCreatingFor] = React.useState<CreatingForType>(CreatingForType.CHAT);
  const [teamGoal, setTeamGoal] = React.useState<TeamGoalType>(TeamGoalType.HANDOFF);
  const canContinue = !!userRole && !!teamSize;

  const onContinue = () => {
    const workspaceMeta: PersonalizeWorkspaceMeta = {
      role: userRole,
      company,
      teamSize,
      selfReportedAttribution,
      projectType: getCreatingForProjectType[creatingFor],
      creatingFor,
      teamGoal,
    };

    actions.setPersonalizeWorkspaceMeta(workspaceMeta);
    actions.stepForward(StepID.CREATE_WORKSPACE);
  };

  const teamSizeOptionLookup = React.useMemo(() => Utils.array.createMap(TEAM_SIZE_OPTIONS, Utils.object.selectID), [TEAM_SIZE_OPTIONS]);

  return (
    <S.Container>
      <Label>Company Name</Label>
      <Input placeholder="Enter company name" value={company} onChangeText={setCompany} />
      <Label>Your Role</Label>
      <RoleSelect userRole={userRole} setUserRole={setUserRole} />
      <Label>Team Size</Label>
      <Select
        value={teamSize}
        options={TEAM_SIZE_OPTIONS}
        getOptionValue={(option) => option?.id}
        getOptionKey={(option) => option.id}
        getOptionLabel={(value) => (value ? teamSizeOptionLookup[value]?.label : undefined)}
        onSelect={(value) => setTeamSize(value as TeamSizeType)}
        placeholder="How many collaborators will you have?"
      />
      <Label>What goal best describes your team?</Label>
      <RadioGroup isFlat options={TEAM_GOAL_OPTIONS} checked={teamGoal} onChange={setTeamGoal} />
      <Label>What modality is your team building for?</Label>
      <RadioGroup isFlat options={CREATING_FOR_OPTIONS} checked={creatingFor} onChange={setCreatingFor} />

      <Label>How did you hear about us?</Label>
      <Input placeholder="Linkedin, Discord, Conference" value={selfReportedAttribution} onChangeText={setSelfReportedAttribution} />

      <Box.FlexCenter paddingTop={32}>
        <ContinueButton disabled={!canContinue} onClick={onContinue}>
          Continue
        </ContinueButton>
      </Box.FlexCenter>
    </S.Container>
  );
};

export default PersonalizeWorkspace;
