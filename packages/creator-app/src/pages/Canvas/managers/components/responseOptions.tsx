/* eslint-disable sonarjs/no-identical-functions */
import { AnyButton, ButtonsLayout } from '@voiceflow/general-types';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { MenuOption } from '@/components/NestedMenu/OptionsMenu';
import { toast } from '@/components/Toast';
import { PlatformType } from '@/constants';
import * as Prototype from '@/ducks/prototype';
import { NodeData } from '@/models/NodeData';
import NoReplyResponse, { repromptFactory } from '@/pages/Canvas/components/NoReplyResponse';
import ButtonsSection, { buttonsFactory } from '@/pages/Canvas/components/SuggestionButtons/Section';
import { CheckboxOption } from '@/pages/Canvas/managers/Speak/SpeakEditor';
import { PushToPath } from '@/pages/Canvas/managers/types';
import { NodeDataUpdater } from '@/pages/Canvas/types';
import { PlatformContext } from '@/pages/Skill/contexts';
import { Nullable } from '@/types';
import { getPlatformValue } from '@/utils/platform';
import { isAlexaPlatform } from '@/utils/typeGuards';

interface NodeInterface<T> {
  data: T;
  onChange: NodeDataUpdater<T>;
  pushToPath?: PushToPath;
}

type Option = [MenuOption | null, false | React.ReactNode];

export const useButtonOption = ({ data, onChange, pushToPath }: NodeInterface<{ buttons: Nullable<AnyButton[]> }>): Option => {
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

export const useNoReplyOption = ({ data, onChange, pushToPath }: NodeInterface<{ reprompt: NodeData.Reprompt | null }>): Option => {
  const hasNoReply = !!data.reprompt;
  const toggleNoReply = React.useCallback(() => onChange({ reprompt: hasNoReply ? null : repromptFactory() }), [hasNoReply, onChange]);

  return [
    {
      label: hasNoReply ? 'Remove No Reply Response' : 'Add  No Reply Response',
      onClick: toggleNoReply,
    },
    hasNoReply && <NoReplyResponse pushToPath={pushToPath!} />,
  ];
};

const buttonLayoutLabel = {
  [ButtonsLayout.STACKED]: 'Stacked',
  [ButtonsLayout.CAROUSEL]: 'Carousel',
};

export const useButtonLayoutOption = (): MenuOption => {
  const buttons = useSelector(Prototype.prototypeButtonsSelector) ?? ButtonsLayout.STACKED;
  const dispatch = useDispatch();

  const platform = React.useContext(PlatformContext)!;

  const updateButtons = async (buttons: ButtonsLayout) => {
    await dispatch(Prototype.updateSharePrototypeSettings({ buttons }));
    toast.success(
      `Global ${getPlatformValue(platform, { [PlatformType.GOOGLE]: 'chips' }, 'buttons')} layout updated to '${buttonLayoutLabel[buttons]}'`
    );
  };

  return {
    label: `${getPlatformValue(platform, { [PlatformType.GOOGLE]: 'Chips' }, 'Buttons')} Layout`,
    options: [
      {
        label: (
          <CheckboxOption checked={buttons === ButtonsLayout.STACKED} onChange={() => updateButtons(ButtonsLayout.STACKED)}>
            Stacked
          </CheckboxOption>
        ),
        disabled: true,
      },
      {
        label: (
          <CheckboxOption checked={buttons === ButtonsLayout.CAROUSEL} onChange={() => updateButtons(ButtonsLayout.CAROUSEL)}>
            Carousel
          </CheckboxOption>
        ),
        disabled: true,
      },
    ],
  };
};
