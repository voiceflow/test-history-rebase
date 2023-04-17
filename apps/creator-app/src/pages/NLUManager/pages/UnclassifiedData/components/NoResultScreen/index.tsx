import { Box, FlexCenter, SvgIcon, System } from '@voiceflow/ui';
import React from 'react';

import { UNCLASSIFIED_DATA_INTIAL_STATE, useNLUManager } from '@/pages/NLUManager/context';

const NoResultsScreen: React.FC = () => {
  const nluManager = useNLUManager();

  const onClear = () => {
    nluManager.setSearch('');
    nluManager.setUnclassifiedDataFilters(UNCLASSIFIED_DATA_INTIAL_STATE.unclassifiedDataFilters);
  };

  return (
    <Box.FlexCenter flexDirection="column" fullWidth fullHeight pb={60}>
      <FlexCenter>
        <SvgIcon size={80} icon="noResult" />
      </FlexCenter>

      <FlexCenter>
        <Box mt={16} fontWeight={600}>
          No results found
        </Box>
      </FlexCenter>

      <FlexCenter>
        <Box mt={8} mb={16} textAlign="center" color="#62778c" maxWidth={250}>
          We found no utterances that match your search results. <System.Link.Button onClick={onClear}>Clear filters</System.Link.Button>
        </Box>
      </FlexCenter>
    </Box.FlexCenter>
  );
};

export default NoResultsScreen;
