import { Box, Divider, Popper, Surface } from '@voiceflow/ui-next';
import React from 'react';

import * as Project from '@/components/Project';

import type { IAssistantExportPopper } from './AssistantExportPopper.interface';

export const AssistantExportPopper: React.FC<IAssistantExportPopper> = ({ referenceElement }) => {
  return (
    <Popper placement="bottom-end" referenceElement={referenceElement}>
      {() => (
        <Surface width="438px">
          <Box mb={24}>
            <Project.Export.Content disableAnimation />
          </Box>

          <Divider noPadding />

          <Box height={90} px={32}>
            <Project.Export.Footer />
          </Box>
        </Surface>
      )}
    </Popper>
  );
};
