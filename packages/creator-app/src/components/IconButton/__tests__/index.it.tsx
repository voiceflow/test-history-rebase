import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { withTheme } from '@/utils/testing';

import IconButton from '..';

const ThemedButton = withTheme(IconButton);

it('reacts to click', () => {
  const clickHandler = jest.fn();
  render(<ThemedButton onClick={clickHandler} icon="lock" />);

  fireEvent.click(screen.getByRole('button'));

  expect(clickHandler).toHaveBeenCalledTimes(1);
});
