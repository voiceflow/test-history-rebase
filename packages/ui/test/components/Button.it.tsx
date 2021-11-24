import { fireEvent, render, screen } from '@testing-library/react';
import Button from '@ui/components/Button';
import { Utils } from '@voiceflow/common';
import React from 'react';

import { ThemeProvider } from '../_utils';

it('reacts to click', () => {
  const clickHandler = jest.fn();
  render(<Button onClick={clickHandler}>{Utils.generate.string()}</Button>, { wrapper: ThemeProvider });

  fireEvent.click(screen.getByRole('button'));

  expect(clickHandler).toHaveBeenCalledTimes(1);
});
