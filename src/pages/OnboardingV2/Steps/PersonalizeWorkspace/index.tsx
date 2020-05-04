import React, { useContext } from 'react';

import Button from '@/components/Button';
import DropdownMultiselect from '@/components/DropdownMultiselect';
import { FlexCenter } from '@/components/Flex';
import { toggleMembership } from '@/utils/array';

import StepID from '../../StepIDs';
import { OnboardingContext } from '../../context';
import { Label, RoleSelect } from '../components';
import { Container, SizeButton, SizeRow, TeamSizeContainer } from './components';

const ChannelSelect: any = DropdownMultiselect;

const TEAM_SIZES = ['Only Me', '2 - 5', '6 - 10', '11 - 15', '16 - 20', '20 +'];

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
  const canContinue = userRole && channels.length && teamSize;

  const displayName = channels
    .map((channelValue: string) => CHANNEL_OPTIONS.find((channel: { label: string; value: string }) => channel.value === channelValue)?.label)
    .join(', ');

  const onContinue = () => {
    actions.setPersonalizeWorkspaceMeta({
      role: userRole,
      channels,
      teamSize,
    });
    actions.stepForward(StepID.ADD_COLLABORATORS);
  };

  return (
    <Container>
      <Label>Choose your role</Label>
      <RoleSelect userRole={userRole} setUserRole={setUserRole} />
      <Label>What channels are you creating for?</Label>
      <ChannelSelect
        maxHeight={320}
        maxVisibleItems={9.5}
        multiSectionOptions={CHANNEL_TYPE_OPTIONS}
        buttonLabel="Unselect All"
        selectedValue={displayName}
        withCaret
        dropdownActive
        buttonClick={() => setChannels([])}
        selectedItems={channels}
        onSelect={(channel: string) => setChannels(toggleMembership(channels, channel))}
        placeholder="Choose all that apply"
        customOptionLabelStyling={customOptionLabelStyling}
      />
      <Label>How many people are on your team?</Label>
      <TeamSizeContainer>
        <SizeRow>
          {TEAM_SIZES.map((size, index) => {
            return (
              <SizeButton onClick={() => setTeamSize(size)} selected={teamSize === size} key={index}>
                {size}
              </SizeButton>
            );
          })}
        </SizeRow>
      </TeamSizeContainer>
      <FlexCenter>
        <Button disabled={!canContinue} variant="primary" onClick={onContinue}>
          Continue
        </Button>
      </FlexCenter>
    </Container>
  );
};

export default PersonalizeWorkspace;
