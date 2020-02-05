import React from 'react';

import SvgIcon from '@/components/SvgIcon';

import Icon from './components';

function ImageIcon({ background, size = 42, placeholderSize = 'inherit' }) {
  return (
    <Icon size={size} background={background}>
      {!background && <SvgIcon icon="image" size={placeholderSize} color="#d4d9e6" />}
    </Icon>
  );
}

export default ImageIcon;
