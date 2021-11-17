import { fireEvent, render, screen } from '@testing-library/react';
import IconButton from '@ui/components/IconButton';
import React from 'react';

import { ThemeProvider } from '../_utils';

it('reacts to click', () => {
  const clickHandler = jest.fn();
  render(<IconButton onClick={clickHandler} icon="lock" size="small" />, { wrapper: ThemeProvider });

  fireEvent.click(screen.getByRole('button'));

  expect(clickHandler).toHaveBeenCalledTimes(1);
});
