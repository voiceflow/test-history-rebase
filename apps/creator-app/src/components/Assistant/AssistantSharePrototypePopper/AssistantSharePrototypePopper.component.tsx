import { Box, Divider, Popper, Surface } from '@voiceflow/ui-next';
import React from 'react';

import * as Project from '@/components/Project';

import type { IAssistantSharePrototypePopper } from './AssistantSharePrototypePopper.interface';

export const AssistantSharePrototypePopper: React.FC<IAssistantSharePrototypePopper> = ({ referenceElement }) => {
  const [isClosePrevented, setIsClosedPrevented] = React.useState(false);

  return (
    <Popper placement="bottom-end" onPreventClose={() => isClosePrevented} referenceElement={referenceElement}>
      {() => (
        <Surface width="438px">
          <Project.SharePrototype.Content
            enableClose={() => setIsClosedPrevented(false)}
            preventClose={() => setIsClosedPrevented(true)}
            disableAnimation
          />

          <Divider noPadding />

          <Box height={90} px={32}>
            <Project.SharePrototype.Footer />
          </Box>
        </Surface>
      )}
    </Popper>
  );
};
