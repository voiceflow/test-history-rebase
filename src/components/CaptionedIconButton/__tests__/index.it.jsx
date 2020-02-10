import React from 'react';
import renderer from 'react-test-renderer';

import { simulate, withTheme } from '@/utils/testing';

import CaptionedIconButton from '..';

const ThemedButton = withTheme(CaptionedIconButton);

it('reacts to click', () => {
  const clickHandler = jest.fn();
  const component = renderer.create(
    <ThemedButton onClick={clickHandler} icon="elipsis">
      Click Me!
    </ThemedButton>
  );

  simulate('click', component);

  expect(clickHandler).toHaveBeenCalledTimes(1);
});
