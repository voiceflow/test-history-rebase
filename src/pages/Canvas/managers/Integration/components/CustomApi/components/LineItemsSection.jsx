import React from 'react';

import AddMinusButton from '@/components/AddMinusButton';
import Section from '@/components/Section';

function LineItemsSection({ header, dividers = false, onAdd, children }) {
  const AddLineItemButton = <AddMinusButton onClick={onAdd} />;

  return (
    <Section dividers={dividers} variant="tertiary" header={header} status={AddLineItemButton}>
      {children}
    </Section>
  );
}

export default LineItemsSection;
