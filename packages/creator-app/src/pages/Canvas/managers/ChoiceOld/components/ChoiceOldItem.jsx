import { Badge, SVG, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import Section from '@/components/Section';
import { styled } from '@/hocs';

import ChoiceOldInput from './ChoiceOldInput';

const StyledSvgIcon = styled(SvgIcon)`
  cursor: pointer;
  color: #8da2b570;

  &:hover {
    color: #8da2b5;
  }
`;

const ChoiceItem = ({ index, choice, onChange, onRemove }) => (
  <Section prefix={<Badge>{index + 1}</Badge>} suffix={<StyledSvgIcon icon={SVG.close} size={14} onClick={onRemove} />}>
    <ChoiceOldInput index={index} choice={choice} onChange={onChange} onRemove={onRemove} />
  </Section>
);

export default React.memo(ChoiceItem);
