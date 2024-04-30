import { act, fireEvent, screen } from '@testing-library/react';
import { Utils } from '@voiceflow/common';
import React from 'react';
import { describe, expect, it } from 'vitest';

import { renderThemed } from '@/test/theme';

import type { DefaultVariantInputProps } from '.';
import Input from '.';

const InputImpl = (props: DefaultVariantInputProps) => {
  const [value, setValue] = React.useState(Utils.generate.string());

  return <Input onChange={({ target: { value } }) => setValue(value)} value={value} {...props} />;
};

describe('Input', () => {
  it('accepts keyboard input', () => {
    const nextValue = Utils.generate.string();
    const placeholder = Utils.generate.string();
    renderThemed(<InputImpl placeholder={placeholder} />);

    const input = screen.getByPlaceholderText(placeholder);

    act(() => {
      fireEvent.change(input, { target: { value: nextValue } });
    });

    expect(input).toHaveValue(nextValue);
  });
});
