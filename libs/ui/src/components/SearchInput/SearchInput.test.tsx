import { act, fireEvent } from '@testing-library/react';
import { Utils } from '@voiceflow/common';
import React from 'react';
import { describe, expect, it } from 'vitest';

import { renderThemed } from '@/test/theme';

import type { SearchInputProps } from '.';
import SearchInput from '.';

const SearchInputImpl = (props: SearchInputProps) => {
  const [value, setValue] = React.useState(Utils.generate.string());

  return <SearchInput onChange={({ target: { value } }) => setValue(value)} value={value} {...props} />;
};

describe('SearchInput', () => {
  it('accepts keyboard input', () => {
    const nextValue = Utils.generate.string();
    renderThemed(<SearchInputImpl />);

    const input = document.querySelector('input')!;

    act(() => {
      fireEvent.change(input, { target: { value: nextValue } });
    });

    expect(input).toHaveValue(nextValue);
  });
});
