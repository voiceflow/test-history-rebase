import React from 'react';

import Portal from '@/components/Portal';
import SvgIcon from '@/components/SvgIcon';
import { ChannelType } from '@/constants';
import ChannelSelect from '@/pages/NewProject/Steps/ChannelSelect';

import { StepID } from '../../constants';
import { OnboardingContext } from '../../context';
import { DocsLink } from './components';

const SelectChannel: React.FC = () => {
  const { state, actions } = React.useContext(OnboardingContext);

  const onContinue = (channel: ChannelType | null) => {
    if (!channel) return;

    actions.setSelectChannelMeta({ channel });
    actions.stepForward(state.justCreatingWorkspace && !state.hasWorkspaces ? null : StepID.PAYMENT);
  };

  return (
    <>
      <ChannelSelect onSelect={onContinue} isLoading={false} instruction="Choose a channel for your first Voiceflow project" />
      <Portal>
        <DocsLink href="https://docs.voiceflow.com/#/platform/project-creation/project-creation?id=differences-between-channels">
          <SvgIcon icon="information" />
          Compare channel types
        </DocsLink>
      </Portal>
    </>
  );
};

export default SelectChannel;
