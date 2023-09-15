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
    width: 232,
    content: <TippyTooltip.Complex title={nluConfig.tooltip.title}>{nluConfig.tooltip.description}</TippyTooltip.Complex>,
    position: 'right',
  },
});

export const OPTIONS: Array<Option | UIOnlyMenuItemOption> = [
  buildOption(NLU.Voiceflow.CONFIG),
  createDividerMenuItemOption(),
  buildOption(NLU.DialogflowES.CONFIG),
  buildOption(NLU.DialogflowCX.CONFIG),
  buildOption(NLU.Watson.CONFIG),
  buildOption(NLU.Rasa.CONFIG),
  buildOption(NLU.Einstein.CONFIG),
  buildOption(NLU.Lex.CONFIG),
  buildOption(NLU.NuanceMix.CONFIG),
];
