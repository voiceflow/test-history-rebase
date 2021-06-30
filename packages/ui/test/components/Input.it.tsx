import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import Input, { InputProps } from '../../src/components/Input';
import { generate } from '../../src/utils';
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
