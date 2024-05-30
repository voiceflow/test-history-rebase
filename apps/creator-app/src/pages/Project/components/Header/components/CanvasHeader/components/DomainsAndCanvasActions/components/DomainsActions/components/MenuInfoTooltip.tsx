import { BlockText, SvgIcon, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { DOMAINS } from '@/config/documentation';
import { onOpenInternalURLInANewTabFactory } from '@/utils/window';

const InfoTooltip = () => (
  <TippyTooltip
    width={232}
    content={
      <TippyTooltip.FooterButton title="Domains" onClick={onOpenInternalURLInANewTabFactory(DOMAINS)} buttonText="More">
        <BlockText mb="8px">Domains allow your team to organize large agents into smaller collections of topics.</BlockText>
        All agent content: NLU data, responses and components are automatically sharable across all domains in the agent.
      </TippyTooltip.FooterButton>
    }
    interactive
  >
    <SvgIcon icon="info" variant={SvgIcon.Variant.STANDARD} clickable reducedOpacity />
  </TippyTooltip>
);

export default InfoTooltip;
