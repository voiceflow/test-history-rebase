import { render, screen } from '@testing-library/react';
import Alert from '@ui/components/Alert';
import { Utils } from '@voiceflow/common';
import React from 'react';

import suite from '../_suite';
import { ThemeProvider } from '../_utils';

suite('Alert', () => {
  it('renders default variant', () => {
    const text = Utils.generate.string();
    render(<Alert>{text}</Alert>, { wrapper: ThemeProvider });

    const alert = screen.getByText(text);

    expect(alert.parentElement).toHaveStyleRule('color', '#3a6b93');
    expect(alert.parentElement).toHaveStyleRule('background', '#e3eff8');
  });

  it('renders danger variant', () => {
    const text = Utils.generate.string();
    render(<Alert variant={Alert.Variant.DANGER}>{text}</Alert>, { wrapper: ThemeProvider });

    const alert = screen.getByText(text);

    expect(alert.parentElement).toHaveStyleRule('color', '#721c24');
    expect(alert.parentElement).toHaveStyleRule('background', '#f8d7da');
  });

  it('renders warning variant', () => {
    const text = Utils.generate.string();
    render(<Alert variant={Alert.Variant.WARNING}>{text}</Alert>, { wrapper: ThemeProvider });

    const alert = screen.getByText(text);

    expect(alert.parentElement).toHaveStyleRule('color', '#856404');
    expect(alert.parentElement).toHaveStyleRule('background', '#fff3cd');
  });
});
