import { act, fireEvent, render } from '@testing-library/react';
import type { SearchInputProps } from '@ui/components/SearchInput';
import SearchInput from '@ui/components/SearchInput';
import { Utils } from '@voiceflow/common';
import React from 'react';

import suite from '../_suite';
import { ThemeProvider } from '../_utils';

const SearchInputImpl = (props: SearchInputProps) => {
  const [value, setValue] = React.useState(Utils.generate.string());

  return <SearchInput onChange={({ target: { value } }) => setValue(value)} value={value} {...props} />;
};

suite('SearchInput', () => {
  it('accepts keyboard input', () => {
    const nextValue = Utils.generate.string();
    render(<SearchInputImpl />, { wrapper: ThemeProvider });

    const input = document.querySelector('input')!;

    act(() => {
      fireEvent.change(input, { target: { value: nextValue } });
    });

    expect(input).toHaveValue(nextValue);
  });
});
