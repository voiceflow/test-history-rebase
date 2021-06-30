import { act, fireEvent, render } from '@testing-library/react';
import React from 'react';

import SearchInput, { SearchInputProps } from '../../src/components/SearchInput';
import { generate } from '../../src/utils';
import { ThemeProvider } from '../_utils';

const SearchInputImpl = (props: SearchInputProps) => {
  const [value, setValue] = React.useState(generate.string());

  return <SearchInput onChange={({ target: { value } }) => setValue(value)} value={value} {...props} />;
};

it('accepts keyboard input', () => {
  const nextValue = generate.string();
  render(<SearchInputImpl />, { wrapper: ThemeProvider });

  const input = document.querySelector('input')!;

  act(() => {
    fireEvent.change(input, { target: { value: nextValue } });
  });

  expect(input).toHaveValue(nextValue);
});
