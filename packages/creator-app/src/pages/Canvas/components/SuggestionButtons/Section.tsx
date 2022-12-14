import { BaseButton } from '@voiceflow/base-types';
import * as Platform from '@voiceflow/platform-config';
import { Text } from '@voiceflow/ui';
import React from 'react';

import Section from '@/components/Section';
import { useActiveProjectPlatform } from '@/hooks';
import { getPlatformValue } from '@/utils/platform';

import InfoTooltip from './InfoTooltip';

export const buttonsFactory = (): BaseButton.IntentButton[] => [{ name: '', type: BaseButton.ButtonType.INTENT, payload: { intentID: null } }];

export const SUGGESTION_BUTTONS_PATH_TYPE = 'buttons';

interface ButtonsSectionProps {
  pushToPath?: (path: { type: string; label: string }) => void;
}

const ButtonsSection: React.FC<ButtonsSectionProps> = ({ pushToPath }) => {
  const platform = useActiveProjectPlatform();
  const openButtons = React.useCallback(
    () =>
      pushToPath?.({
        type: SUGGESTION_BUTTONS_PATH_TYPE,
        label: getPlatformValue(platform, { [Platform.Constants.PlatformType.GOOGLE]: 'chips' }, 'buttons'),
      }),
    [pushToPath]
  );

  return (
    <Section
      header={<Text fontWeight="normal">{getPlatformValue(platform, { [Platform.Constants.PlatformType.GOOGLE]: 'Chips' }, 'Buttons')}</Text>}
      status="Empty"
      isLink
      tooltip={<InfoTooltip />}
      onClick={openButtons}
    />
  );
};

export default ButtonsSection;
