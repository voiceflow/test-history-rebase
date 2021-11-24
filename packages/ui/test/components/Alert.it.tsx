import { render, screen } from '@testing-library/react';
import Alert from '@ui/components/Alert';
import { Utils } from '@voiceflow/common';
import React from 'react';

import { ThemeProvider } from '../_utils';

it('renders default variant', () => {
  const text = Utils.generate.string();
  render(<Alert>{text}</Alert>, { wrapper: ThemeProvider });

  const alert = screen.getByText(text);

  expect(alert).toHaveStyleRule('color', '#5d9df5');
  expect(alert).toHaveStyleRule('background', '#5d9df515');
  expect(alert).toHaveStyleRule('border', '1px solid #5d9df515');
});

it('renders danger variant', () => {
  const text = Utils.generate.string();
  render(<Alert variant="danger">{text}</Alert>, { wrapper: ThemeProvider });

  const alert = screen.getByText(text);

  expect(alert).toHaveStyleRule('color', '#721c24');
  expect(alert).toHaveStyleRule('background', '#f8d7da');
  expect(alert).toHaveStyleRule('border', '1px solid #f8d7da');
});

it('renders warning variant', () => {
  const text = Utils.generate.string();
  render(<Alert variant="warning">{text}</Alert>, { wrapper: ThemeProvider });

  const alert = screen.getByText(text);

  expect(alert).toHaveStyleRule('color', '#856404');
  expect(alert).toHaveStyleRule('background', '#fff3cd');
  expect(alert).toHaveStyleRule('border', '1px solid #ffeeba');
});
