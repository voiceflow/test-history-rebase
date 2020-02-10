import React from 'react';

import Badge from '@/components/Badge';
import Button from '@/components/LegacyButton';
import { Section } from '@/pages/Canvas/components/Editor';

import ChoiceOldInput from './ChoiceOldInput';

function ChoiceItem({ index, choice, onChange, onRemove }) {
  return (
    <Section prefix={<Badge>{index + 1}</Badge>} suffix={<Button className="close" onClick={onRemove} />}>
      <ChoiceOldInput index={index} choice={choice} onChange={onChange} onRemove={onRemove} />
    </Section>
  );
}

export default React.memo(ChoiceItem);
