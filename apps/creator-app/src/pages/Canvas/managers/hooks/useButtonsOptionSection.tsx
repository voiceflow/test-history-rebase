import { BaseButton } from '@voiceflow/base-types';
import { Nullable } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';
import React from 'react';

import { useActiveProjectPlatform } from '@/hooks';
// importing from Section to resolve circular dependency
import ButtonsSection, { buttonsFactory } from '@/pages/Canvas/components/SuggestionButtons/Section';
import { PushToPath } from '@/pages/Canvas/managers/types';
import { NodeDataUpdater } from '@/pages/Canvas/types';
import { getPlatformValue } from '@/utils/platform';
import { isAlexaPlatform } from '@/utils/typeGuards';

import { OptionSection } from './types';

interface NodeInterface<T> {
  data: T;
  onChange: NodeDataUpdater<T>;
  pushToPath?: PushToPath;
}

const useButtonsOptionSection = ({ data, onChange, pushToPath }: NodeInterface<{ buttons: Nullable<BaseButton.AnyButton[]> }>): OptionSection => {
  const hasButtons = !!data.buttons;
  const platform = useActiveProjectPlatform();
  const toggleButtons = React.useCallback(() => onChange({ buttons: hasButtons ? null : buttonsFactory() }), [hasButtons, onChange]);

  const buttonsName = getPlatformValue(platform, { [Platform.Constants.PlatformType.GOOGLE]: 'Chips' }, 'Buttons');

  return [
    isAlexaPlatform(platform)
      ? null
      : {
          label: hasButtons ? `Remove ${buttonsName}` : `Add ${buttonsName}`,
          onClick: toggleButtons,
        },
    hasButtons && <ButtonsSection pushToPath={pushToPath} />,
  ];
};

export default useButtonsOptionSection;
