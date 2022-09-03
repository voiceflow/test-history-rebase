import { Box, IconButton, Popper, Preview, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { DOCS_BASE_LINK } from '@/config/documentation';
import { onOpenInternalURLInANewTabFactory } from '@/utils/window';

const HelpTooltip: React.FC = () => {
  return (
    <Popper
      placement="bottom"
      borderRadius="8px"
      renderContent={() => (
        <Preview style={{ maxWidth: '232px' }}>
          <Preview.Content style={{ paddingTop: '11px', paddingBottom: 0 }}>
            <Preview.Title>Intent conflicts</Preview.Title>

            <Box mb="8px">
              <Preview.Text>
                The intents below contain conflicting utterances that can cause unintended behaviour when running your assistant.
              </Preview.Text>
            </Box>
            <Preview.Text>Edit, remove, or transfer them to the proper intent to resolve the conflicts.</Preview.Text>
          </Preview.Content>

          <TippyTooltip.FooterButton onClick={onOpenInternalURLInANewTabFactory(DOCS_BASE_LINK)} buttonText="More" />
        </Preview>
      )}
    >
      {({ ref, onToggle }) => <IconButton onClick={onToggle} ref={ref} size={16} icon="info" variant={IconButton.Variant.BASIC} offsetSize={0} />}
    </Popper>
  );
};

export default HelpTooltip;
