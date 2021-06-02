import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { withTheme } from '@/utils/testing';

import Button from '..';

const ThemedButton = withTheme(Button);

it('reacts to click', () => {
  const clickHandler = jest.fn();
  render(<ThemedButton onClick={clickHandler}>Click Me!</ThemedButton>);

  fireEvent.click(screen.getByRole('button'));

  expect(clickHandler).toHaveBeenCalledTimes(1);
});
