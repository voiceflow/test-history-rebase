import { useToggle } from '@voiceflow/ui';
import React from 'react';
import { useFocused, useSelected } from 'slate-react';

import type { PopperItem, PopperProps } from './components';
import { Popper } from './components';

interface SuggestionsProps<T extends PopperItem> extends Omit<PopperProps<T>, 'isSelected' | 'togglePopperFocused'> {
  isSelected?: boolean;
}

const Suggestions = <T extends PopperItem>(props: SuggestionsProps<T>): React.ReactElement<any, any> | null => {
  const isFocused = useFocused();
  const isElementSelected = useSelected();

  const [isPopperFocused, togglePopperFocused] = useToggle(false);

  const isSelected = isFocused && isElementSelected && props.isSelected;
  const isRendered = isPopperFocused || isSelected;

  return isRendered ? <Popper {...props} togglePopperFocused={togglePopperFocused} /> : null;
};

export default Suggestions;
