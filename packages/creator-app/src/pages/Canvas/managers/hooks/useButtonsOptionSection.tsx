import { Button } from '@voiceflow/base-types';
import { PlatformType } from '@voiceflow/internal';
import React from 'react';

// importing from Section to resolve circular dependency
import ButtonsSection, { buttonsFactory } from '@/pages/Canvas/components/SuggestionButtons/Section';
import { PushToPath } from '@/pages/Canvas/managers/types';
import { NodeDataUpdater } from '@/pages/Canvas/types';
import { PlatformContext } from '@/pages/Skill/contexts';
import { Nullable } from '@/types';
import { getPlatformValue } from '@/utils/platform';
import { isAlexaPlatform } from '@/utils/typeGuards';

import { OptionSection } from './types';

interface NodeInterface<T> {
  data: T;
  onChange: NodeDataUpdater<T>;
  pushToPath?: PushToPath;
}

const useButtonsOptionSection = ({ data, onChange, pushToPath }: NodeInterface<{ buttons: Nullable<Button.AnyButton[]> }>): OptionSection => {
  const hasButtons = !!data.buttons;
  const platform = React.useContext(PlatformContext)!;
  const toggleButtons = React.useCallback(() => onChange({ buttons: hasButtons ? null : buttonsFactory() }), [hasButtons, onChange]);

  const buttonsName = getPlatformValue(platform, { [PlatformType.GOOGLE]: 'Chips' }, 'Buttons');

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
