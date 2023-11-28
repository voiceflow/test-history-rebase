import { Utils } from '@voiceflow/common';
import { Box, Input, Select } from '@voiceflow/ui';
import React, { useContext } from 'react';

import RadioGroup from '@/components/RadioGroup';
import ContinueButton from '@/pages/Onboarding/components/ContinueButton';

import { StepID, TEAM_SIZE_OPTIONS, WORK_WITH_DEVELOPERS_OPTIONS } from '../../constants';
import { OnboardingContext } from '../../context';
import { PersonalizeWorkspaceMeta } from '../../context/types';
import { TeamSizeType } from '../../types';
import { Label, UseCaseSelect } from '../components';
import * as S from './styles';

const PersonalizeWorkspace: React.FC = () => {
  const { state, actions } = useContext(OnboardingContext);
  const [useCase, setUseCase] = React.useState(state.personalizeWorkspaceMeta.useCase || '');
  const [workWithDevelopers, setWorkWithDevelopers] = React.useState<boolean | null>(state.personalizeWorkspaceMeta.workWithDevelopers || null);
  const [selfReportedAttribution, setSelfReportedAttribution] = React.useState('');
  const [teamSize, setTeamSize] = React.useState<TeamSizeType>();
  const canContinue = !!useCase && !!teamSize && !!selfReportedAttribution && workWithDevelopers !== null;

  const onContinue = () => {
    const workspaceMeta: PersonalizeWorkspaceMeta = {
      useCase,
      teamSize,
      selfReportedAttribution,
      workWithDevelopers,
    };

    actions.setPersonalizeWorkspaceMeta(workspaceMeta);
    actions.stepForward(StepID.CREATE_WORKSPACE);
  };

  const teamSizeOptionLookup = React.useMemo(() => Utils.array.createMap(TEAM_SIZE_OPTIONS, Utils.object.selectID), [TEAM_SIZE_OPTIONS]);

  return (
    <S.Container>
      <Label>What are you building?</Label>
      <UseCaseSelect useCase={useCase} setUseCase={setUseCase} />
      <Label>How big is your team?</Label>
      <Select
        value={teamSize}
        options={TEAM_SIZE_OPTIONS}
        getOptionValue={(option) => option?.id}
        getOptionKey={(option) => option.id}
        getOptionLabel={(value) => (value ? teamSizeOptionLookup[value]?.label : undefined)}
        onSelect={(value) => setTeamSize(value as TeamSizeType)}
        placeholder="Select team size"
      />
      <Label>Are you working with developers?</Label>
      <RadioGroup isFlat options={WORK_WITH_DEVELOPERS_OPTIONS} checked={workWithDevelopers} onChange={setWorkWithDevelopers} />
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
