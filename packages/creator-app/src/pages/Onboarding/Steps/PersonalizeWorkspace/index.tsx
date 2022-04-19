import { Utils } from '@voiceflow/common';
import { FlexCenter } from '@voiceflow/ui';
import React, { useContext } from 'react';

import DropdownMultiselect from '@/components/DropdownMultiselect';
import RadioGroup from '@/components/RadioGroup';
import { FeatureFlag } from '@/config/features';
import { useFeature } from '@/hooks';
import ContinueButton from '@/pages/Onboarding/components/ContinueButton';

import { CREATING_FOR_OPTIONS, getCreatingForProjectType, StepID } from '../../constants';
import { OnboardingContext } from '../../context';
import { PersonalizeWorkspaceMeta } from '../../context/types';
import { CreatingForType } from '../../types';
import { Label, RoleSelect } from '../components';
import { Container, SizeButton, SizeRow, TeamSizeContainer } from './components';

const ChannelSelect: any = DropdownMultiselect;

const TEAM_SIZES = ['Only Me', '2 - 3', '4 - 6', '7 - 10', '11 - 20', '20 +'];

const CHANNEL_OPTIONS = [
  // Voice
  { label: 'Amazon Alexa', value: 'Amazon Alexa' },
  { label: 'Google Assistant', value: 'Google Assistant' },
  { label: 'IVR', value: 'IVR' },
  { label: 'Samsung Bixby', value: 'Samsung Bixby' },
  { label: 'Siri', value: 'Siri' },
  // Chat
  { label: 'Facebook Messenger', value: 'Facebook Messenger' },
  { label: 'Website', value: 'Website' },
  { label: 'Whatsapp', value: 'Whatsapp' },
  { label: 'SMS', value: 'SMS' },
  { label: 'Slack', value: 'Slack' },
  { label: 'Apple Business Chat', value: 'Apple Business Chat' },
  { label: 'RCS', value: 'RCS' },
  { label: 'Viber', value: 'Viber' },
  { label: 'Wechat', value: 'Wechat' },
  { label: 'Twitter', value: 'Twitter' },
];

const customOptionLabelStyling = {
  fontSize: '15px',
  fontWeight: 'normal',
  textTransform: 'none',
  color: '#132144',
};

const VoiceChannelOptions = CHANNEL_OPTIONS.slice(0, 5);
const ChatChannelOptions = CHANNEL_OPTIONS.slice(6, CHANNEL_OPTIONS.length);

const CHANNEL_TYPE_OPTIONS = [
  {
    sectionLabel: 'Voice',
    options: VoiceChannelOptions,
  },
  {
    sectionLabel: 'Chat',
    options: ChatChannelOptions,
  },
];

const PersonalizeWorkspace: React.FC = () => {
  const { state, actions } = useContext(OnboardingContext);
  const [userRole, setUserRole] = React.useState(state.personalizeWorkspaceMeta.role || '');
  const [channels, setChannels] = React.useState(state.personalizeWorkspaceMeta.channels || []);
  const [teamSize, setTeamSize] = React.useState(state.personalizeWorkspaceMeta.teamSize || '');
  const [creatingFor, setCreatingFor] = React.useState<CreatingForType>(CreatingForType.CHAT);
  const projectCreateFeature = useFeature(FeatureFlag.PROJECT_CREATE);
  const canContinue = userRole && teamSize && (!projectCreateFeature.isEnabled ? channels.length : true);

  const displayName = channels
    .map((channelValue: string) => CHANNEL_OPTIONS.find((channel: { label: string; value: string }) => channel.value === channelValue)?.label)
    .join(', ');

  const onContinue = () => {
    const workspaceMeta: PersonalizeWorkspaceMeta = {
      role: userRole,
      teamSize,
    };

    if (projectCreateFeature.isEnabled) {
      workspaceMeta.projectType = getCreatingForProjectType[creatingFor];
    } else {
      workspaceMeta.channels = channels;
    }

    actions.setPersonalizeWorkspaceMeta(workspaceMeta);
    actions.stepForward(StepID.CREATE_WORKSPACE);
  };

  return (
    <Container>
      <Label>Choose your role</Label>
      <RoleSelect userRole={userRole} setUserRole={setUserRole} />
      {projectCreateFeature.isEnabled ? (
        <>
          <Label>What are you creating for?</Label>
          <RadioGroup isFlat options={CREATING_FOR_OPTIONS} checked={creatingFor} onChange={setCreatingFor} />
        </>
      ) : (
        <>
          <Label>What channels are you creating for?</Label>
          <ChannelSelect
            maxHeight={190}
            maxVisibleItems={6.5}
            multiSectionOptions={CHANNEL_TYPE_OPTIONS}
            buttonLabel="Done"
            selectedValue={displayName}
            withCaret
            dropdownActive
            buttonClick={(_: unknown, { onToggle }: { onToggle: () => void }) => onToggle()}
            selectedItems={channels}
            onSelect={(channel: string) => setChannels(Utils.array.toggleMembership(channels, channel))}
            placeholder="Choose all that apply"
            customOptionLabelStyling={customOptionLabelStyling}
          />
        </>
      )}

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
