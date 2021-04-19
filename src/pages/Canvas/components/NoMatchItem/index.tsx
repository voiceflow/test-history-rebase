import React from 'react';

import SpeakItem, { SpeakItemProps } from '@/pages/Canvas/components/SpeakItem';

export type NoMatchItemProps = Omit<SpeakItemProps, 'header' | 'formControlProps'>;

const NO_MATCH_NUMBERS = ['One', 'Two', 'Three'];

const NoMatchItem: React.ForwardRefRenderFunction<HTMLElement, NoMatchItemProps> = (props, ref) => {
  const number = NO_MATCH_NUMBERS[props.index] ?? '';

  return <SpeakItem {...props} header={`No Match ${number}`} ref={ref} formControlProps={{ contentBottomUnits: 2.5 }} />;
};

export default React.forwardRef<HTMLElement, NoMatchItemProps>(NoMatchItem);
