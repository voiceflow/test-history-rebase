import { SvgIcon } from '@voiceflow/ui';
import React from 'react';

import Icon from './components';

const ImageIcon = ({ background, size = 42, placeholderSize = 'inherit' }) => (
  <Icon size={size} background={background}>
    {!background && <SvgIcon icon="image" size={placeholderSize} color="#d4d9e6" />}
  </Icon>
);

export default ImageIcon;
