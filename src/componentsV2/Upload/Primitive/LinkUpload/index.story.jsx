import { text } from '@storybook/addon-knobs';
import _ from 'lodash';
import React from 'react';

import LinkUpload from '.';

const getProps = () => ({
  placeholder: text('Placeholder', 'placeholder'),
  validate: _.constant('Error message'),
});

export default {
  title: 'Upload/Primitive/Link',
  component: LinkUpload,
};

export const withBackButton = () => <LinkUpload onBack={_.noop} {...getProps()} />;

export const withoutBackButton = () => <LinkUpload {...getProps()} />;
