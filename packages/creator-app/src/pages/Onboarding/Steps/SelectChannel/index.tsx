import { Constants } from '@voiceflow/general-types';
import React from 'react';

import ChannelSelect from '@/pages/NewProject/Steps/ChannelSelect';

import { StepID } from '../../constants';
import { OnboardingContext } from '../../context';

const SelectChannel: React.FC = () => {
  const { state, actions } = React.useContext(OnboardingContext);

  const onContinue = (platform: Constants.PlatformType | null) => {
    if (!platform) return;

    actions.setSelectChannelMeta({ channel: platform });
    actions.stepForward(state.justCreatingWorkspace && !state.hasWorkspaces ? null : StepID.PAYMENT);
  };

  return <ChannelSelect onSelect={onContinue} isLoading={false} />;
};

export default SelectChannel;
