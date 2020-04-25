import { number, select, text } from '@storybook/addon-knobs';
import React from 'react';

import Box from '@/components/Box';
import THEME from '@/styles/theme';

import { ClickableText, Link, OverflowText, Text } from '.';

const getProps = () => ({
  fontSize: select('size', Object.keys(THEME.fontSizes), 'm'),
  color: select('color', Object.keys(THEME.colors), 'primary'),
  children: text('text', 'Hello this is some text'),
});

export default {
  title: 'Text',
  component: Text,
};

export const TextStory = () => {
  return <Text {...getProps()} />;
};

export const ClickableTextStory = () => {
  return <ClickableText {...getProps()} />;
};

export const OverflowTextStory = () => {
  const width = number('overflow width', 150);
  return (
    <Box maxWidth={width}>
      <OverflowText {...getProps()} />
    </Box>
  );
};

export const LinkStory = () => {
  const children = text('text', 'this is a link');
  return <Link href="#">{children}</Link>;
};
