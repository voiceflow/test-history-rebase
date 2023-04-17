import { fireEvent, render, screen } from '@testing-library/react';
import IconButton from '@ui/components/IconButton';
import React from 'react';

import suite from '../_suite';
import { ThemeProvider } from '../_utils';

suite('IconButton', () => {
  it('reacts to click', () => {
    const clickHandler = vi.fn();
    render(<IconButton onClick={clickHandler} icon="lock" size="small" />, { wrapper: ThemeProvider });

    fireEvent.click(screen.getByRole('button'));

    expect(clickHandler).toHaveBeenCalledTimes(1);
  });
});
