import { Box, Button, EmptyPage } from '@voiceflow/ui-next';
import React from 'react';

import { CMSRoute } from '@/config/routes';
import { CMS_FUNCTIONS_LEARN_MORE } from '@/constants/link.constant';
import * as Router from '@/ducks/router';
import { useDispatch } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';

export const EmptyFunction = () => {
  const goToCMSResourceModal = useDispatch(Router.goToCMSResourceModal);

  const onCreateFunction = () => {
    goToCMSResourceModal(CMSRoute.FUNCTION, ModalsV2.Function.CreateModalID);
  };

  return (
    <Box justify="center" align="center" pt={36} direction="column">
      <EmptyPage
        title="No functions exist"
        illustration="Functions"
        description="Functions can be used to create reusable code, make API calls, and transforming data. "
        learnMoreLink={CMS_FUNCTIONS_LEARN_MORE}
      />
      <Box width="280px" px={24} py={16}>
        <Button label="Create function" fullWidth onClick={onCreateFunction} />
      </Box>
    </Box>
  );
};
