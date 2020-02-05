import { boolean } from '@storybook/addon-knobs';
import React from 'react';

import IconUpload from '.';

const IMAGE_URL = 'https://nerdbot.com/wp-content/uploads/2018/09/mrP.jpg';

const getProps = () => {
  const hasImageLink = boolean('hasImage', false);

  return {
    image: hasImageLink ? IMAGE_URL : null,
    error: boolean('has error', false),
    isLoading: boolean('loading', false),
  };
};

export default {
  title: 'Upload/Icon',
  component: IconUpload,
};

export const small = () => <IconUpload size="small" {...getProps()} />;

export const medium = () => <IconUpload size="medium" {...getProps()} />;

export const large = () => <IconUpload size="large" {...getProps()} />;

export const xlarge = () => <IconUpload size="xlarge" {...getProps()} />;
