import { Badge, LegacyButton } from '@voiceflow/ui';
import React from 'react';

import Section from '@/components/Section';

import ChoiceOldInput from './ChoiceOldInput';

const ChoiceItem = ({ index, choice, onChange, onRemove }) => (
  <Section prefix={<Badge>{index + 1}</Badge>} suffix={<LegacyButton className="close" onClick={onRemove} />}>
    <ChoiceOldInput index={index} choice={choice} onChange={onChange} onRemove={onRemove} />
  </Section>
);

export default React.memo(ChoiceItem);
