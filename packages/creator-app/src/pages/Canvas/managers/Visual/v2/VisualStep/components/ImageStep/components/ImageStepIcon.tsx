import React from 'react';

import { styled } from '@/hocs';

import imageStepIcon from './image-step-icon.png';

const IconStyle = styled.img`
  width: 50px;
  margin-right: 12px;
`;

const ImageStepIcon: React.FC = () => {
  // to do: replace with svg icon. Waiting for Mike
  return <IconStyle src={imageStepIcon} />;
};

export default ImageStepIcon;
