import { boolean } from '@storybook/addon-knobs';
import React from 'react';

import { styled } from '@/hocs';

import ImageGroupUpload from '.';

const Container = styled.div`
  width: 500px;
  margin-top: 30px;
`;

const IMAGE_URL = 'https://nerdbot.com/wp-content/uploads/2018/09/mrP.jpg';

const getProps = () => {
  const hasImageLink = boolean('hasImage', false);

  return {
    image: hasImageLink ? IMAGE_URL : null,
  };
};

export default {
  title: 'Upload/Image Group',
  component: ImageGroupUpload,
};

export const normal = () => (
  <Container>
    <ImageGroupUpload {...getProps()} />
  </Container>
);
