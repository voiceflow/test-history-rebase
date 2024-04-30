import { fireEvent, screen } from '@testing-library/react';
import { Utils } from '@voiceflow/common';
import { describe, expect, it } from 'vitest';

import THEME from '@/styles/theme';
import { renderThemed } from '@/test/theme';

import Badge from '.';

describe('Badge', () => {
  it('does not appear clickable', () => {
    const text = Utils.generate.string();
    renderThemed(<Badge>{text}</Badge>);

    const badge = screen.getByText(text);

    expect(badge).toHaveStyle({ cursor: undefined, color: THEME.colors.secondary });
  });

  it('reacts to click', () => {
    const clickHandler = vi.fn();
    renderThemed(<Badge onClick={clickHandler}>Click Me!</Badge>);

    const badge = screen.getByRole('button');
    fireEvent.click(badge);

    expect(clickHandler).toHaveBeenCalledTimes(1);
    expect(badge).toHaveStyle({ cursor: 'pointer' });
  });

  it('changes color', () => {
    const color = '#ff69b4';
    const text = Utils.generate.string();
    renderThemed(<Badge color={color}>{text}</Badge>);

    const badge = screen.getByText(text);

    expect(badge).toHaveStyle({ background: color, border: `1px solid ${color}` });
  });
});
