/* eslint-disable sonarjs/no-identical-functions */
import { ButtonsLayout, Chip } from '@voiceflow/general-types';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { MenuOption } from '@/components/NestedMenu/OptionsMenu';
import { toast } from '@/components/Toast';
import { PlatformType } from '@/constants';
import * as Prototype from '@/ducks/prototype';
import { NodeData } from '@/models/NodeData';
import NoReplyResponse, { repromptFactory } from '@/pages/Canvas/components/NoReplyResponse';
import ChipSection, { chipFactory } from '@/pages/Canvas/components/SuggestionChips/components/ChipSection';
import { CheckboxOption } from '@/pages/Canvas/managers/Speak/SpeakEditor';
import { PushToPath } from '@/pages/Canvas/managers/types';
import { NodeDataUpdater } from '@/pages/Canvas/types';
import { PlatformContext } from '@/pages/Skill/contexts';

interface NodeInterface<T> {
  data: T;
  onChange: NodeDataUpdater<T>;
  pushToPath?: PushToPath;
}

type Option = [MenuOption | null, false | React.ReactNode];

export const useChipOption = ({ data, onChange, pushToPath }: NodeInterface<{ chips: Chip[] | null }>): Option => {
  const hasChips = !!data.chips;
  const toggleChips = React.useCallback(() => onChange({ chips: hasChips ? null : chipFactory() }), [hasChips, onChange]);
  const isAlexa = React.useContext(PlatformContext) === PlatformType.ALEXA;

  return [
    isAlexa
      ? null
      : {
          label: hasChips ? 'Remove Suggestion Chips' : 'Add Suggestion Chips',
          onClick: toggleChips,
        },
    hasChips && <ChipSection pushToPath={pushToPath!} />,
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

export const useButtonOption = (): MenuOption => {
  const buttons = useSelector(Prototype.prototypeButtonsSelector) ?? ButtonsLayout.STACKED;
  const dispatch = useDispatch();
  const updateButtons = async (buttons: ButtonsLayout) => {
    await dispatch(Prototype.updateSharePrototypeSettings({ buttons }));
    toast.success(`Global chip layout updated to '${buttonLayoutLabel[buttons]}'`);
  };

  return {
    label: 'Chips Layout',
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
