import _ from 'lodash';
import React from 'react';

import SvgIcon, { Icon } from '@/components/SvgIcon';

import PrefixContainer from './PrefixContainer';

export type FixNodeProps = {
  fixNode: Icon | React.ReactNode;
  color: string;
};

const FixNode: React.FC<FixNodeProps> = ({ fixNode, color }) => (
  <PrefixContainer>{_.isString(fixNode) ? <SvgIcon color={color} icon={fixNode as Icon} /> : fixNode}</PrefixContainer>
);

export default FixNode;
