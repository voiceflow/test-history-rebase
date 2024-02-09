import { Box, Button, EmptyPage } from '@voiceflow/ui-next';
import React from 'react';

import { CMSRoute } from '@/config/routes';
import { CMS_COMPONENT_LEARN_MORE } from '@/constants/link.constant';
import { useGoToCMSResourceModal } from '@/hooks/cms-resource.hook';
import * as ModalsV2 from '@/ModalsV2';

export const EmptyComponent = () => {
  const goToCMSComponentCreateModal = useGoToCMSResourceModal(CMSRoute.COMPONENT);

  const onCreateComponent = () => {
    goToCMSComponentCreateModal(ModalsV2.Component.Create, { folderID: null });
  };

  return (
    <Box justify="center" align="center" pt={36} direction="column">
      <EmptyPage
        title="No components exist"
        illustration="VFComponent"
        description="Components are saved sets of blocks that you can reuse across your agent. "
        learnMoreLink={CMS_COMPONENT_LEARN_MORE}
      />
      <Box width="280px" px={24} py={16}>
        <Button label="Create component" fullWidth onClick={onCreateComponent} />
      </Box>
    </Box>
  );
};
