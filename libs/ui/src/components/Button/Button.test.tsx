import { fireEvent, screen } from '@testing-library/react';
import { Utils } from '@voiceflow/common';
import { describe, expect, it } from 'vitest';

import { renderThemed } from '@/test/theme';

import Button from '.';

describe('Button', () => {
  it('reacts to click', () => {
    const clickHandler = vi.fn();
    renderThemed(<Button onClick={clickHandler}>{Utils.generate.string()}</Button>);

    fireEvent.click(screen.getByRole('button'));

    expect(clickHandler).toHaveBeenCalledTimes(1);
  });
});
