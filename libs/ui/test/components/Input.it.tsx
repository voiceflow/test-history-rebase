import { act, fireEvent, render, screen } from '@testing-library/react';
import Input, { DefaultVariantInputProps } from '@ui/components/Input';
import { Utils } from '@voiceflow/common';
import React from 'react';

import suite from '../_suite';
import { ThemeProvider } from '../_utils';

const InputImpl = (props: DefaultVariantInputProps) => {
  const [value, setValue] = React.useState(Utils.generate.string());

  return <Input onChange={({ target: { value } }) => setValue(value)} value={value} {...props} />;
};

suite('Input', () => {
  it('accepts keyboard input', () => {
    const nextValue = Utils.generate.string();
    const placeholder = Utils.generate.string();
    render(<InputImpl placeholder={placeholder} />, { wrapper: ThemeProvider });

    const input = screen.getByPlaceholderText(placeholder);

    act(() => {
      fireEvent.change(input, { target: { value: nextValue } });
    });

    expect(input).toHaveValue(nextValue);
  });
});
