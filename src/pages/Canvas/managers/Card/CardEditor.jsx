import React from 'react';

import RadioGroup from '@/components/RadioGroup';
import Section from '@/componentsV2/Section';
import { CardType } from '@/constants';
import { Content } from '@/pages/Canvas/components/Editor';

import { CardForm, CardFormFooter } from './components';

const CARD_TYPE_OPTIONS = [
  {
    id: CardType.STANDARD,
    label: 'Standard',
  },
  {
    id: CardType.SIMPLE,
    label: 'Simple',
  },
];

function CardEditor({ data, onChange }) {
  const isStandard = data.cardType !== CardType.SIMPLE;
  const updateCardType = React.useCallback((cardType) => onChange({ cardType }), [onChange]);

  return (
    <Content footer={<CardFormFooter isStandard={isStandard} data={data} onChange={onChange} />}>
      <Section variant="tertiary" header="Card Type">
        <RadioGroup options={CARD_TYPE_OPTIONS} checked={data.cardType} onChange={updateCardType} />
      </Section>

      <Section isDividerNested>
        <CardForm withImage={isStandard} data={data} onChange={onChange} />
      </Section>
    </Content>
  );
}

export default CardEditor;
