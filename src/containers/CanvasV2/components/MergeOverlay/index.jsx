import React from 'react';

import SvgIcon from '@/components/SvgIcon';
import { MergeStatus } from '@/containers/CanvasV2/constants';

import { MergeStatusContext } from './contexts';
import { mergeStatusStyle } from './styles';

const MergeOverlay = ({ component: Component, ...props }) => {
  const mergeStatus = React.useContext(MergeStatusContext);
  const canMerge = mergeStatus === MergeStatus.ACCEPT;
  const cannotMerge = mergeStatus === MergeStatus.DENY;

  return (
    <Component {...props} style={mergeStatusStyle(canMerge, cannotMerge)}>
      {canMerge && <SvgIcon icon="plus" color="#fff" size={24} />}
      {cannotMerge && <SvgIcon icon="warning" color="#8f8f8f" size={24} />}
    </Component>
  );
};

export default MergeOverlay;
