import { array, number, select, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';

import Variant from '@/../.storybook/Variant';
import * as ICONS from '@/svgs';

import SvgIcon from '.';

storiesOf('Svg Icon', module).add('variants', () => {
  const size = number('size', 24);
  const icon = select('icon', Object.keys(ICONS), ICONS.mail);
  const color = text('color', '#000');
  const width = number('width', 24);
  const height = number('height', 24);
  const transitionArray = array('transition array', ['width', 'height']);
  const transitionString = text('transition string', 'width');

  return (
    <>
      <Variant label="size">
        <SvgIcon size={size} icon={icon} color={color} transition={transitionString} />
      </Variant>

      <Variant label="width height">
        <SvgIcon width={width} height={height} icon={icon} color={color} transition={transitionString} />
      </Variant>

      <Variant label="transition array">
        <SvgIcon size={size} icon={icon} color={color} transition={transitionArray} />
      </Variant>
    </>
  );
});
