import type * as Platform from '@voiceflow/platform-config';
import React from 'react';

import ChannelSelect from '@/pages/Onboarding/Steps/SelectChannel/ChannelSelect';

import { StepID } from '../../constants';
import { OnboardingContext } from '../../context';

const SelectChannel: React.FC = () => {
  const { state, actions } = React.useContext(OnboardingContext);

  const onContinue = (
    option: { platform: Platform.Constants.PlatformType; projectType: Platform.Constants.ProjectType } | null
  ) => {
    if (!option) return;

    actions.setSelectChannelMeta(option);
    actions.stepForward(state.justCreatingWorkspace && !state.hasWorkspaces ? null : StepID.PAYMENT);
  };

  return <ChannelSelect onSelect={onContinue} isLoading={false} />;
};

export default SelectChannel;
