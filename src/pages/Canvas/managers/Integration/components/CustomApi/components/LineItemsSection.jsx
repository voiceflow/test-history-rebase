import React from 'react';

import AddMinusButton from '@/components/AddMinusButton';
import Section from '@/components/Section';
import { FormControl } from '@/pages/Canvas/components/Editor';

function LineItemsSection({ header, dividers = false, onAdd, children }) {
  const AddLineItemButton = <AddMinusButton onClick={onAdd} />;

  return (
    <Section dividers={dividers} variant="subsection" header={header} status={AddLineItemButton}>
      <FormControl>{children}</FormControl>
    </Section>
  );
}

export default LineItemsSection;
