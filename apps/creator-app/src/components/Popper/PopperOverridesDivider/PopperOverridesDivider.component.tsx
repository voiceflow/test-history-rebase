import { Box, Divider } from '@voiceflow/ui-next';
import React from 'react';

import { useObjectsDiffsCount } from '@/hooks/object.hook';
import { stopPropagation } from '@/utils/handler.util';

import { containerStyle } from './PopperOverridesDivider.css';
import { IPopperOverridesDivider } from './PopperOverridesDivider.interface';

export const PopperOverridesDivider: React.FC<IPopperOverridesDivider> = ({ value, onReset, initialValues }) => {
  const differences = useObjectsDiffsCount(value, initialValues);

  return (
    <Box pt={16} pl={24} className={containerStyle}>
      <Divider
        label={differences > 0 ? `Reset ${differences} overrides` : 'Overrides'}
        onLabelClick={differences > 0 ? stopPropagation(onReset) : undefined}
      />
    </Box>
  );
};
