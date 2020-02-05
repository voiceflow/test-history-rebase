import React from 'react';

import AddMinusButton from '@/componentsV2/AddMinusButton';
import Section from '@/componentsV2/Section';

function LineItemsSection({ header, dividers = false, onAdd, children }) {
  const AddLineItemButton = <AddMinusButton onClick={onAdd} />;

  return (
    <Section dividers={dividers} variant="tertiary" header={header} status={AddLineItemButton}>
      {children}
    </Section>
  );
}

export default LineItemsSection;
