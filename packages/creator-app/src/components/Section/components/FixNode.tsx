import { Icon, SvgIcon } from '@voiceflow/ui';
import _isString from 'lodash/isString';
import React from 'react';

import PrefixContainer from './PrefixContainer';

export interface FixNodeProps {
  color: string;
  fixNode: Icon | React.ReactNode;
  overflowHidden?: boolean;
}

const FixNode: React.FC<FixNodeProps> = ({ fixNode, color, overflowHidden }) => {
  return (
    <PrefixContainer overflowHidden={overflowHidden}>
      {_isString(fixNode) ? <SvgIcon color={color} icon={fixNode as Icon} /> : fixNode}
    </PrefixContainer>
  );
};

export default FixNode;
