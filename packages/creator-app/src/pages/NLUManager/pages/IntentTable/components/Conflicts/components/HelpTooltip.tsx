import { Button as UIButton, SvgIcon, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { NLU_MANAGEMENT_CONFLICTS } from '@/config/documentation';
import { styled } from '@/hocs/styled';
import { onOpenInternalURLInANewTabFactory } from '@/utils/window';

export const MoreButton = styled(UIButton.DarkButton)`
  padding: 10px 0px;
`;

const HelpTooltip: React.FC = () => (
  <TippyTooltip
    width={232}
    placement="bottom"
    interactive
    content={
      <>
        <TippyTooltip.Complex title="Intent Conflicts">
          The intents below contain conflicting utterances that can cause unintended behaviour when running your assistant.
          <br />
          <br />
          Edit, remove, or transfer them to the proper intent to resolve the conflicts.
        </TippyTooltip.Complex>
        <TippyTooltip.FooterButton
          onClick={onOpenInternalURLInANewTabFactory(NLU_MANAGEMENT_CONFLICTS)}
          buttonText="More"
        ></TippyTooltip.FooterButton>
      </>
    }
  >
    <SvgIcon size={16} icon="info" clickable color="#8da2b5" />
  </TippyTooltip>
);

export default HelpTooltip;
