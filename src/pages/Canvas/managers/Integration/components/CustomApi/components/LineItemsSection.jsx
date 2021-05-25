import React from 'react';

import { Add } from '@/components/InteractiveIcon';
import Section from '@/components/Section';
import { FormControl } from '@/pages/Canvas/components/Editor';

const LineItemsSection = ({ header, dividers = false, onAdd, children }) => {
  const AddLineItemButton = <Add onClick={onAdd} />;

  return (
    <Section dividers={dividers} variant="subsection" header={header} status={AddLineItemButton}>
      <FormControl contentBottomUnits={React.Children.count(children) ? 0 : 1}>{children}</FormControl>
    </Section>
  );
};

export default LineItemsSection;
