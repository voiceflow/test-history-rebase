import { fireEvent, render, screen } from '@testing-library/react';
import Badge from '@ui/components/Badge';
import THEME from '@ui/styles/theme';
import { generate } from '@ui/utils';
import React from 'react';

import { ThemeProvider } from '../_utils';

it('does not appear clickable', () => {
  const text = generate.string();
  render(<Badge>{text}</Badge>, { wrapper: ThemeProvider });

  const badge = screen.getByText(text);

  expect(badge).toHaveStyleRule('cursor', undefined);
  expect(badge).toHaveStyleRule('color', THEME.colors.secondary);
});

it('reacts to click', () => {
  const clickHandler = jest.fn();
  render(<Badge onClick={clickHandler}>Click Me!</Badge>, { wrapper: ThemeProvider });

  const badge = screen.getByRole('button');
  fireEvent.click(badge);

  expect(clickHandler).toHaveBeenCalledTimes(1);
  expect(badge).toHaveStyleRule('cursor', 'pointer');
});

it('changes color', () => {
  const color = '#ff69b4';
  const text = generate.string();
  render(<Badge color={color}>{text}</Badge>, { wrapper: ThemeProvider });

  const badge = screen.getByText(text);

  expect(badge).toHaveStyleRule('background', color);
  expect(badge).toHaveStyleRule('border', `1px solid ${color}`);
});
