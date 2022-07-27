import { SvgIcon, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

const InfoTooltip = () => (
  <TippyTooltip
    html={
      <TippyTooltip.FooterButton width={232} title="Domains" onClick={() => {}} buttonText="More">
        Domains allow your team to organize large assistants into smaller collections of topics.
        <br />
        <br />
        All assistant content: NLU data, responses and components are automatically sharable across all domains in the assistant.
      </TippyTooltip.FooterButton>
    }
    interactive
  >
    <SvgIcon variant={SvgIcon.Variant.STANDARD} clickable icon="info" />
  </TippyTooltip>
);

export default InfoTooltip;
