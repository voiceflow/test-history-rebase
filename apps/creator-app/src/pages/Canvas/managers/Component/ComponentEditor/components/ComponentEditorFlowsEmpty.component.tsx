import { Flow } from '@voiceflow/dtos';
import { Box, Button, EmptyPage } from '@voiceflow/ui-next';
import React from 'react';

import { CMS_FLOW_LEARN_MORE } from '@/constants/link.constant';
import * as ModalsV2 from '@/ModalsV2';

interface IComponentEditorFlowsEmpty {
  onCreate: (flow: Flow) => void;
}

export const ComponentEditorFlowsEmpty = ({ onCreate }: IComponentEditorFlowsEmpty) => {
  const createModal = ModalsV2.useModal(ModalsV2.Flow.Create);

  const onCreateFlow = async () => {
    const result = await createModal.openVoid({ folderID: null });

    if (result) onCreate(result);
  };

  return (
    <Box justify="center" align="center" pt={36} direction="column">
      <EmptyPage
        title="No components exist"
        illustration="VFComponent"
        description="Components are saved sets of blocks that you can reuse across your agent. "
        learnMoreLink={CMS_FLOW_LEARN_MORE}
      />
      <Box width="280px" px={24} py={16}>
        <Button label="Create component" fullWidth onClick={onCreateFlow} />
      </Box>
    </Box>
  );
};
