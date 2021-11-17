import { act, fireEvent, render, screen } from '@testing-library/react';
import Input, { InputProps } from '@ui/components/Input';
import { generate } from '@ui/utils';
import React from 'react';

import { ThemeProvider } from '../_utils';

const InputImpl = (props: InputProps) => {
  const [value, setValue] = React.useState(generate.string());

  return <Input onChange={({ target: { value } }) => setValue(value)} value={value} {...props} />;
};

it('accepts keyboard input', () => {
  const nextValue = generate.string();
  const placeholder = generate.string();
  render(<InputImpl placeholder={placeholder} />, { wrapper: ThemeProvider });

  const input = screen.getByPlaceholderText(placeholder);

  act(() => {
    fireEvent.change(input, { target: { value: nextValue } });
  });

  expect(input).toHaveValue(nextValue);
});
