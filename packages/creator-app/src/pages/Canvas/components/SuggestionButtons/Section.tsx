import { Button } from '@voiceflow/base-types';
import { PlatformType } from '@voiceflow/internal';
import { Text } from '@voiceflow/ui';
import React from 'react';

import Section from '@/components/Section';
import { PlatformContext } from '@/pages/Skill/contexts';
import { getPlatformValue } from '@/utils/platform';

import InfoTooltip from './InfoTooltip';

export const buttonsFactory = (): Button.IntentButton[] => [{ name: '', type: Button.ButtonType.INTENT, payload: { intentID: null } }];

interface ButtonsSectionProps {
  pushToPath?: (path: { type: string; label: string }) => void;
}

const ButtonsSection: React.FC<ButtonsSectionProps> = ({ pushToPath }) => {
  const platform = React.useContext(PlatformContext)!;
  const openButtons = React.useCallback(
    () => pushToPath?.({ type: 'buttons', label: getPlatformValue(platform, { [PlatformType.GOOGLE]: 'chips' }, 'buttons') }),
    [pushToPath]
  );

  return (
    <Section
      header={<Text fontWeight="normal">{getPlatformValue(platform, { [PlatformType.GOOGLE]: 'Chips' }, 'Buttons')}</Text>}
      status="Empty"
      isLink
      tooltip={<InfoTooltip />}
      onClick={openButtons}
      tooltipProps={{ helpTitle: null, helpMessage: null }}
    />
  );
};

export default ButtonsSection;
