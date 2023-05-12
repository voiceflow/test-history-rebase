import { Box, SvgIcon } from '@voiceflow/ui';
import React from 'react';

// component when table is empty

const EmptyView: React.FC = () => {
  return (
    <Box.FlexCenter>
      <SvgIcon size={80} icon="noContent" />
    </Box.FlexCenter>
  );
};

export default EmptyView;
