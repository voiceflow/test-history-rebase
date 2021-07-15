import React from 'react';

import SpeakItem, { SpeakItemProps } from '@/pages/Canvas/components/SpeakItem';
import { convertToWord } from '@/utils/number';
import { capitalizeFirstLetter } from '@/utils/string';

export type NoMatchItemProps = Omit<SpeakItemProps, 'header' | 'formControlProps'>;

const NoMatchItem: React.ForwardRefRenderFunction<HTMLElement, NoMatchItemProps> = (props, ref) => {
  const number = capitalizeFirstLetter(convertToWord(props.index + 1));

  return <SpeakItem {...props} header={`Reprompt ${number}`} ref={ref} formControlProps={{ contentBottomUnits: 2.5 }} />;
};

export default React.forwardRef<HTMLElement, NoMatchItemProps>(NoMatchItem);
