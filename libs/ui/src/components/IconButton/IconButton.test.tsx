import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderThemed } from '@/test/theme';

import IconButton from '.';

describe('IconButton', () => {
  it('reacts to click', () => {
    const clickHandler = vi.fn();
    renderThemed(<IconButton onClick={clickHandler} icon={'lock' as any} size="small" />);

    fireEvent.click(screen.getByRole('button'));

    expect(clickHandler).toHaveBeenCalledTimes(1);
  });
});
