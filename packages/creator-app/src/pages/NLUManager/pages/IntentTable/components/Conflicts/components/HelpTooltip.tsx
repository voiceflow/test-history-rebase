import { Box, Button as UIButton, Popper, Preview, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { NLU_MANAGEMENT_CONFLICTS } from '@/config/documentation';
import { styled } from '@/hocs';
import { onOpenInternalURLInANewTabFactory } from '@/utils/window';

export const MoreButton = styled(UIButton.DarkButton)`
  padding: 10px 0px;
`;

const HelpTooltip: React.FC = () => (
  <Popper
    placement="bottom"
    renderContent={({ onClose }) => (
      <Preview style={{ maxWidth: '232px' }} onMouseLeave={() => onClose()}>
        <Preview.Content style={{ paddingTop: '11px', paddingBottom: 0 }}>
          <Preview.Title>Intent conflicts</Preview.Title>

          <Box mb="8px" mt="4px" lineHeight="18px">
            <Preview.Text>
              The intents below contain conflicting utterances that can cause unintended behaviour when running your assistant.
            </Preview.Text>
          </Box>
          <Box lineHeight="18px">
            <Preview.Text>Edit, remove, or transfer them to the proper intent to resolve the conflicts.</Preview.Text>
          </Box>
        </Preview.Content>

        <Box p="0px 4px 4px 4px" mt="12px">
          <MoreButton onClick={onOpenInternalURLInANewTabFactory(NLU_MANAGEMENT_CONFLICTS)} fontSize={13}>
            More
          </MoreButton>
        </Box>
      </Preview>
    )}
  >
    {({ ref, onToggle }) => <SvgIcon onMouseEnter={onToggle} ref={ref} size={16} icon="info" clickable color="#8da2b5" />}
  </Popper>
);

export default HelpTooltip;
