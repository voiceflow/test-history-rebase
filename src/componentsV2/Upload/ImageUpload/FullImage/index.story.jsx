import { boolean } from '@storybook/addon-knobs';
import React from 'react';

import { styled } from '@/hocs';

import FullImageUpload from '.';

const IMAGE_URL = 'https://nerdbot.com/wp-content/uploads/2018/09/mrP.jpg';

const Container = styled.div`
  width: 420px;
  margin-top: 50px;
`;

const getProps = () => {
  const hasImageLink = boolean('hasImage', false);
  const [image, setImage] = React.useState('');

  return {
    update: setImage,
    image: image || (hasImageLink ? IMAGE_URL : null),
  };
};

export default {
  title: 'Upload/Full Image',
  component: FullImageUpload,
  includeStories: [],
};

export const normal = () => (
  <Container>
    <FullImageUpload {...getProps()} />
  </Container>
);
