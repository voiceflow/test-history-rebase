import * as Platform from '@voiceflow/platform-config';
import { createDividerMenuItemOption, TippyTooltip, TippyTooltipProps, UIOnlyMenuItemOption } from '@voiceflow/ui';
import React from 'react';

import * as NLU from '@/config/nlu';

export interface Option {
  type: Platform.Constants.NLUType;
  name: string;
  permission: NLU.Base.Config['permission'];
  labelTooltip: TippyTooltipProps;
}

const buildOption = (nluConfig: NLU.Base.Config): Option => ({
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
export const OPTIONS_LEGACY: Array<Option | UIOnlyMenuItemOption> = [
  buildOption(NLU.Voiceflow.CONFIG),
  createDividerMenuItemOption(),
  buildOption(NLU.DialogflowES.CONFIG),
  buildOption(NLU.Watson.CONFIG),
  buildOption(NLU.Luis.CONFIG),
  buildOption(NLU.Rasa.CONFIG),
  buildOption(NLU.Einstein.CONFIG),
  buildOption(NLU.Lex.CONFIG),
  buildOption(NLU.NuanceMix.CONFIG),
];

export const OPTIONS: Array<Option | UIOnlyMenuItemOption> = [
  buildOption(NLU.Voiceflow.CONFIG),
  createDividerMenuItemOption(),
  buildOption(NLU.DialogflowES.CONFIG),
  buildOption(NLU.DialogflowCX.CONFIG),
  buildOption(NLU.Watson.CONFIG),
  buildOption(NLU.Luis.CONFIG),
  buildOption(NLU.Rasa.CONFIG),
  buildOption(NLU.Einstein.CONFIG),
  buildOption(NLU.Lex.CONFIG),
  buildOption(NLU.NuanceMix.CONFIG),
];
