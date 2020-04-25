import { number, select } from '@storybook/addon-knobs';
import React from 'react';

import Box from '.';

export default {
  title: 'Box',
  component: Box,
};

const DISPLAY_OPTIONS = ['flex', 'block', 'inline-block'];

const RELATIVE = ['', 'l', 'r', 't', 'b', 'x', 'y'];
const MARGIN_OPTIONS = RELATIVE.map((r) => `m${r}`);
const PADDING_OPTIONS = RELATIVE.map((r) => `p${r}`);

const COLOR_OPTIONS = ['primary', 'secondary', 'tertiary', 'quaternary', 'red', 'green', 'blue'];

const getProps = () => ({
  [select('marginType', MARGIN_OPTIONS, MARGIN_OPTIONS[0])]: number('margin', 0),
  [select('paddingType', PADDING_OPTIONS, PADDING_OPTIONS[0])]: number('padding', 0),
  color: select('color', COLOR_OPTIONS, COLOR_OPTIONS[0]),
  fontSize: number('font size', 15),
  display: select('display', DISPLAY_OPTIONS, DISPLAY_OPTIONS[0]),
});

export const TextBox = () => (
  <>
    <Box {...getProps()} style={{ border: '1px solid #000' }}>
      <div>Object A</div>
      <div>Object B</div>
    </Box>
    <Box {...getProps()} style={{ border: '1px solid #000' }}>
      <div>Object A</div>
      <div>Object B</div>
    </Box>
  </>
);
