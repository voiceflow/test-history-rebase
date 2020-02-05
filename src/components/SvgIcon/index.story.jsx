import { array, number, select, text } from '@storybook/addon-knobs';
import React from 'react';

import * as ICONS from '@/svgs';

import SvgIcon from '.';

const getProps = () => ({
  icon: select('icon', Object.keys(ICONS), 'mail'),
  color: text('color', '#000'),
  transition: text('transition string', 'width'),
});

export default {
  title: 'SVG Icon',
  component: SvgIcon,
};

export const normal = () => {
  const size = number('size', 24);

  return <SvgIcon size={size} {...getProps()} />;
};

export const withHeightAndWidth = () => {
  const width = number('width', 24);
  const height = number('height', 24);

  return <SvgIcon width={width} height={height} {...getProps()} />;
};

export const withManyTransitions = () => {
  const size = number('size', 24);
  const transition = array('transition array', ['width', 'height']);

  return <SvgIcon size={size} {...getProps()} transition={transition} />;
};
