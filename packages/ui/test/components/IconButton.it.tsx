import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import IconButton from '../../src/components/IconButton';
import { ThemeProvider } from '../_utils';

it('reacts to click', () => {
  const clickHandler = jest.fn();
  render(<IconButton onClick={clickHandler} icon="lock" size="small" />, { wrapper: ThemeProvider });

  fireEvent.click(screen.getByRole('button'));

  expect(clickHandler).toHaveBeenCalledTimes(1);
});
