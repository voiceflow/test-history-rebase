import * as Platform from '@voiceflow/platform-config';
import React from 'react';

import Hover, { HoverButtonProps } from './Hover';

export interface UtteranceButtonProps extends Omit<HoverButtonProps, 'label' | 'quantities' | 'pluralLabel'> {
  hasExtraContext?: boolean;
  contextUtterances?: Platform.Base.Models.Intent.Input[];
}

const UtteranceButton: React.FC<UtteranceButtonProps> = ({ disabled, hasExtraContext, contextUtterances, ...props }) => {
  const utterancesAreEmpty = React.useMemo(() => !contextUtterances?.some((utterance) => !!utterance.text?.trim()), [contextUtterances]);

  return (
    <Hover
      {...props}
      label="utterance"
      disabled={disabled || (!hasExtraContext && utterancesAreEmpty)}
      pluralLabel="utterances"
      quantities={[5, 10, 20]}
    />
  );
};

export default UtteranceButton;
