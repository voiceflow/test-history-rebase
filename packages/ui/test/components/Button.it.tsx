import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import Button from '../../src/components/Button';
import { ThemeProvider } from '../_utils';

it('reacts to click', () => {
  const clickHandler = jest.fn();
  render(<Button onClick={clickHandler}>Click Me!</Button>, { wrapper: ThemeProvider });

  fireEvent.click(screen.getByRole('button'));

  expect(clickHandler).toHaveBeenCalledTimes(1);
});
