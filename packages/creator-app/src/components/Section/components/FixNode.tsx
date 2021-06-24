import { Icon, SvgIcon } from '@voiceflow/ui';
import _isString from 'lodash/isString';
import React from 'react';

import PrefixContainer from './PrefixContainer';

export type FixNodeProps = {
  fixNode: Icon | React.ReactNode;
  color: string;
};

const FixNode: React.FC<FixNodeProps> = ({ fixNode, color }) => (
  <PrefixContainer>{_isString(fixNode) ? <SvgIcon color={color} icon={fixNode as Icon} /> : fixNode}</PrefixContainer>
);

export default FixNode;
