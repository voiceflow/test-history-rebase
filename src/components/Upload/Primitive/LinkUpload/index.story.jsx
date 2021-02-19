import { text } from '@storybook/addon-knobs';
import _constant from 'lodash/constant';
import React from 'react';

import { noop } from '@/utils/functional';

import LinkUpload from '.';

const getProps = () => ({
  placeholder: text('Placeholder', 'placeholder'),
  validate: _constant('Error message'),
});

export default {
  title: 'Upload/Primitive/Link',
  component: LinkUpload,
};

export const withBackButton = () => <LinkUpload onBack={noop} {...getProps()} />;

export const withoutBackButton = () => <LinkUpload {...getProps()} />;
