import { Utils } from '@voiceflow/common';
import { Box, Input, Select } from '@voiceflow/ui';
import React from 'react';

import RadioGroup from '@/components/RadioGroup';
import ContinueButton from '@/pages/Onboarding/components/ContinueButton';

import { UseCaseSelect } from '../../components';
import { TEAM_SIZE_OPTIONS, WORK_WITH_DEVELOPERS_OPTIONS } from '../../constants';
import { useOnboardingContext } from '../../context';
import { TeamSizeType } from '../../types';
import { Label } from '../styles';
import * as S from './styles';

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
