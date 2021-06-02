import React from 'react';

import Badge from '@/components/Badge';
import Button from '@/components/LegacyButton';
import Section from '@/components/Section';

import ChoiceOldInput from './ChoiceOldInput';

const ChoiceItem = ({ index, choice, onChange, onRemove }) => (
  <Section prefix={<Badge>{index + 1}</Badge>} suffix={<Button className="close" onClick={onRemove} />}>
    <ChoiceOldInput index={index} choice={choice} onChange={onChange} onRemove={onRemove} />
  </Section>
);

export default React.memo(ChoiceItem);
