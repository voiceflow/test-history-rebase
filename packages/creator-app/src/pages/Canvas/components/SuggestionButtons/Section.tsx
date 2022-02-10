import { BaseButton } from '@voiceflow/base-types';
import { Text } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import Section from '@/components/Section';
import { PlatformContext } from '@/pages/Project/contexts';
import { getPlatformValue } from '@/utils/platform';

import InfoTooltip from './InfoTooltip';

export const buttonsFactory = (): BaseButton.IntentButton[] => [{ name: '', type: BaseButton.ButtonType.INTENT, payload: { intentID: null } }];

export const SUGGESTION_BUTTONS_PATH_TYPE = 'buttons';

interface ButtonsSectionProps {
  pushToPath?: (path: { type: string; label: string }) => void;
}

const ButtonsSection: React.FC<ButtonsSectionProps> = ({ pushToPath }) => {
  const platform = React.useContext(PlatformContext)!;
  const openButtons = React.useCallback(
    () =>
      pushToPath?.({
        type: SUGGESTION_BUTTONS_PATH_TYPE,
        label: getPlatformValue(platform, { [VoiceflowConstants.PlatformType.GOOGLE]: 'chips' }, 'buttons'),
      }),
    [pushToPath]
  );

  return (
    <Section
      header={<Text fontWeight="normal">{getPlatformValue(platform, { [VoiceflowConstants.PlatformType.GOOGLE]: 'Chips' }, 'Buttons')}</Text>}
      status="Empty"
      isLink
      tooltip={<InfoTooltip />}
      onClick={openButtons}
    />
  );
};

export default ButtonsSection;
