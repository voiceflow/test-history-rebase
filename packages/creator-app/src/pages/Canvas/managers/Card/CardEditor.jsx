import React from 'react';

import RadioGroup from '@/components/RadioGroup';
import Section from '@/components/Section';
import { CardType } from '@/constants';
import { Content, FormControl } from '@/pages/Canvas/components/Editor';

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
      <Section>
        <FormControl label="Card Type" contentBottomUnits={0}>
          <RadioGroup options={CARD_TYPE_OPTIONS} checked={data.cardType} onChange={updateCardType} />
        </FormControl>
      </Section>

      <Section isDividerNested>
        <CardForm withImage={isStandard} data={data} onChange={onChange} />
      </Section>
    </Content>
  );
}

export default CardEditor;
