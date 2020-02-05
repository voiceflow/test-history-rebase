import React from 'react';
import renderer from 'react-test-renderer';

import { simulate, withTheme } from '@/utils/testing';

import IconButton from '..';

const ThemedButton = withTheme(IconButton);

it('reacts to click', () => {
  const clickHandler = jest.fn();
  const component = renderer.create(<ThemedButton onClick={clickHandler} icon="lock" />);

  simulate('click', component);

  expect(clickHandler).toHaveBeenCalledTimes(1);
});
