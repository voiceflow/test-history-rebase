import type { BaseButton, Nullable } from '@voiceflow/base-types';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import EditorV2 from '@/pages/Canvas/components/EditorV2';
import type { OptionalSectionConfig } from '@/pages/Canvas/managers/types';
import { intentButtonFactory } from '@/utils/intent';
import { getPlatformValue } from '@/utils/platform';

import { Section } from './components';
import { PATH } from './constants';

export const useConfig = (): OptionalSectionConfig => {
  const editor = EditorV2.useEditor<{ buttons: Nullable<BaseButton.AnyButton[]> }>();

  const label = getPlatformValue(editor.platform, { [Platform.Constants.PlatformType.GOOGLE]: 'Chips' }, 'Buttons');
  const hasButtons = !!editor.data.buttons;

  return {
    option: Realtime.Utils.typeGuards.isAlexaPlatform(editor.platform)
      ? null
      : {
          label: hasButtons ? `Remove ${label.toLowerCase()}` : `Add ${label.toLowerCase()}`,
          onClick: () => editor.onChange({ buttons: hasButtons ? null : [intentButtonFactory()] }),
        },
    section: hasButtons && <Section label={label} onClick={() => editor.goToNested(PATH)} />,
  };
};
