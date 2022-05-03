import { BoxFlex } from '@ui/components';
import React from 'react';

import GroupHeaderLine from './GroupHeaderLine';
import GroupHeaderTitle from './GroupHeaderTitle';

const GroupHeader: React.FC = ({ children }) => {
  return (
    <BoxFlex pt={16} pb={8}>
      <GroupHeaderTitle>{children}</GroupHeaderTitle>
      <GroupHeaderLine />
    </BoxFlex>
  );
};

export default GroupHeader;
