import React from 'react';

import { Section } from '@/containers/CanvasV2/components/BlockEditor';

import ChoiceInput from './ChoiceInput';

function ChoiceItem({ index, choice, onChange, onRemove }) {
  return (
    <Section>
      <ChoiceInput index={index} choice={choice} onChange={onChange} onRemove={onRemove} />
    </Section>
  );
}

export default React.memo(ChoiceItem);
