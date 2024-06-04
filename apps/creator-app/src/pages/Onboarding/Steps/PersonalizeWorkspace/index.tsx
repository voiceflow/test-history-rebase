import { Utils } from '@voiceflow/common';
import { Box, Input, Select } from '@voiceflow/ui';
import React from 'react';

import RadioGroup from '@/components/RadioGroup';
import ContinueButton from '@/pages/Onboarding/components/ContinueButton';

import { useOnboardingContext } from '../../context';
import { TeamSizeType } from '../../teamSizeType.enum';
import UseCaseSelect from '../../UseCaseSelect';
import { Label } from '../styles';
import * as S from './styles';

export const WORK_WITH_DEVELOPERS_OPTIONS = [
  { id: true, label: 'Yes' },
  { id: false, label: 'No' },
];

export const TEAM_SIZE_OPTIONS = [
  { id: TeamSizeType.INDIVIDUAL, label: 'Just me' },
  { id: TeamSizeType.SMALL, label: 'Small team (2-5)' },
  { id: TeamSizeType.LARGE, label: 'Large team (5+)' },
];

const OnboardingStepsPersonalizeWorkspace: React.FC = () => {
  const {
    state: { personalizeWorkspaceMeta },
    stateAPI,
    stepForward,
  } = useOnboardingContext();

  const { useCase, teamSize, selfReportedAttribution, workWithDevelopers } = personalizeWorkspaceMeta;

  const canContinue = !!useCase && !!teamSize && !!selfReportedAttribution && workWithDevelopers !== null;

  const teamSizeOptionLookup = React.useMemo(
    () => Utils.array.createMap(TEAM_SIZE_OPTIONS, Utils.object.selectID),
    [TEAM_SIZE_OPTIONS]
  );

  return (
    <S.Container>
      <Label>What are you building?</Label>
      <UseCaseSelect
        useCase={useCase}
        setUseCase={(value) => stateAPI.personalizeWorkspaceMeta.update({ useCase: value })}
      />
      <Label>How big is your team?</Label>
      <Select
        value={teamSize}
        options={TEAM_SIZE_OPTIONS}
        getOptionValue={(option) => option?.id}
        getOptionKey={(option) => option.id}
        getOptionLabel={(value) => (value ? teamSizeOptionLookup[value as TeamSizeType]?.label : undefined)}
        onSelect={(value) => stateAPI.personalizeWorkspaceMeta.update({ teamSize: value as TeamSizeType })}
        placeholder="Select team size"
      />
      <Label>Are you working with developers?</Label>
      <RadioGroup
        isFlat
        options={WORK_WITH_DEVELOPERS_OPTIONS}
        checked={workWithDevelopers}
        onChange={(value) => stateAPI.personalizeWorkspaceMeta.update({ workWithDevelopers: value })}
      />
      <Label>How did you hear about us?</Label>
      <Input
        placeholder="Linkedin, Discord, Conference"
        value={selfReportedAttribution}
        onChangeText={(value) => stateAPI.personalizeWorkspaceMeta.update({ selfReportedAttribution: value })}
      />

      <Box.FlexCenter paddingTop={32}>
        <ContinueButton disabled={!canContinue} onClick={() => stepForward()}>
          Continue
        </ContinueButton>
      </Box.FlexCenter>
    </S.Container>
  );
};

export default OnboardingStepsPersonalizeWorkspace;
