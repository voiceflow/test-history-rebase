import { BlockText, SectionV2, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import * as Documentation from '@/config/documentation';

const CommandInfoTooltip: React.FC = () => (
  <SectionV2.InfoIconTooltip width={232} interactive>
    <TippyTooltip.FooterButton title="Commands" buttonText="More" onClick={() => window.open(Documentation.COMMAND_STEP)}>
      <BlockText mb="8px">Commands act as a 'go to and return' function.</BlockText>

      <BlockText>
        Commands are triggered by a global intent that leads into a component. Once the component is complete the conversation will continue from
        wherever the user was before triggering the command.
      </BlockText>
    </TippyTooltip.FooterButton>
  </SectionV2.InfoIconTooltip>
);

export default CommandInfoTooltip;
