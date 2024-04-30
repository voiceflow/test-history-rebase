import { screen } from '@testing-library/react';
import { Utils } from '@voiceflow/common';
import { describe, expect, it } from 'vitest';

import { renderThemed } from '@/test/theme';

import Alert from '.';

describe('Alert', () => {
  it('renders default variant', () => {
    const text = Utils.generate.string();
    renderThemed(<Alert>{text}</Alert>);

    const alert = screen.getByText(text);

    expect(alert.parentElement).toHaveStyle({ color: '#3a6b93' });
    expect(alert.parentElement).toHaveStyle({ background: '#e3eff8' });
  });

  it('renders danger variant', () => {
    const text = Utils.generate.string();
    renderThemed(<Alert variant={Alert.Variant.DANGER}>{text}</Alert>);

    const alert = screen.getByText(text);

    expect(alert.parentElement).toHaveStyle({ color: '#721c24' });
    expect(alert.parentElement).toHaveStyle({ background: '#f8d7da' });
  });

  it('renders warning variant', () => {
    const text = Utils.generate.string();
    renderThemed(<Alert variant={Alert.Variant.WARNING}>{text}</Alert>);

    const alert = screen.getByText(text);

    expect(alert.parentElement).toHaveStyle({ color: '#856404' });
    expect(alert.parentElement).toHaveStyle({ background: '#fff3cd' });
  });
});
