import React from 'react';

import Button from '@/components/Button';
import Badge from '@/componentsV2/Badge';
import { Section } from '@/containers/CanvasV2/components/Editor';

import ChoiceOldInput from './ChoiceOldInput';

function ChoiceItem({ index, choice, onChange, onRemove }) {
  return (
    <Section prefix={<Badge>{index + 1}</Badge>} suffix={<Button className="close" onClick={onRemove} />}>
      <ChoiceOldInput index={index} choice={choice} onChange={onChange} onRemove={onRemove} />
    </Section>
  );
}

export default React.memo(ChoiceItem);
