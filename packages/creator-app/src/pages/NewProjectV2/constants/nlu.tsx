import * as Platform from '@voiceflow/platform-config';
import { MenuItemGrouped, TippyTooltip, TippyTooltipProps } from '@voiceflow/ui';
import React from 'react';

import * as NLU from '@/config/nlu';

export interface NLUOption {
  type: Platform.Constants.NLUType;
  name: string;
  permission: NLU.Base.Config['permission'];
  labelTooltip: TippyTooltipProps;
}

const buildOption = (nluConfig: NLU.Base.Config): NLUOption => ({
  type: nluConfig.type,
  name: nluConfig.name,
  permission: nluConfig.permission,
  labelTooltip: {
    html: (
      <TippyTooltip.Complex title={nluConfig.tooltip.title} width={200}>
        {nluConfig.tooltip.description}
      </TippyTooltip.Complex>
    ),
    position: 'right',
    bodyOverflow: true,
  },
});

/** @deprecated remove after DIALOGFLOW_CX FF gone */
export const NLU_OPTIONS_LEGACY: MenuItemGrouped<NLUOption>[] = [
  {
    id: 'default',
    label: '',
    options: [
      buildOption(NLU.Voiceflow.CONFIG),
      buildOption(NLU.DialogflowES.CONFIG),
      buildOption(NLU.Watson.CONFIG),
      buildOption(NLU.Luis.CONFIG),
      buildOption(NLU.Rasa.CONFIG),
      buildOption(NLU.Einstein.CONFIG),
      buildOption(NLU.Lex.CONFIG),
      buildOption(NLU.NuanceMix.CONFIG),
    ],
  },
  {
    id: 'coming-soon',
    label: 'Coming Soon',
    options: [buildOption(NLU.DialogflowCX.CONFIG)],
  },
];

export const NLU_OPTIONS: MenuItemGrouped<NLUOption>[] = [
  {
    id: 'default',
    label: '',
    options: [
      buildOption(NLU.Voiceflow.CONFIG),
      buildOption(NLU.DialogflowES.CONFIG),
      buildOption(NLU.DialogflowCX.CONFIG),
      buildOption(NLU.Watson.CONFIG),
      buildOption(NLU.Luis.CONFIG),
      buildOption(NLU.Rasa.CONFIG),
      buildOption(NLU.Einstein.CONFIG),
      buildOption(NLU.Lex.CONFIG),
      buildOption(NLU.NuanceMix.CONFIG),
    ],
  },
];
