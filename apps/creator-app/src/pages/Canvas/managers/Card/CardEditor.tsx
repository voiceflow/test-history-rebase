import { BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import RadioGroup from '@/components/RadioGroup';
import Section from '@/components/Section';
import { Content, FormControl } from '@/pages/Canvas/components/Editor';
import { NodeEditor } from '@/pages/Canvas/managers/types';

import { CardForm, CardFormFooter } from './components';

const CARD_TYPE_OPTIONS = [
  {
    id: BaseNode.Card.CardType.STANDARD,
    label: 'Standard',
  },
  {
    id: BaseNode.Card.CardType.SIMPLE,
    label: 'Simple',
  },
];

const CardEditor: NodeEditor<Realtime.NodeData.Card, Realtime.NodeData.CardBuiltInPorts> = ({ data, onChange }) => {
  const isStandard = data.cardType !== BaseNode.Card.CardType.SIMPLE;

  return (
    <Content footer={<CardFormFooter isStandard={isStandard} data={data} onChange={onChange} />}>
      <Section>
        <FormControl label="Card Type" contentBottomUnits={0}>
          <RadioGroup options={CARD_TYPE_OPTIONS} checked={data.cardType} onChange={(cardType) => onChange({ cardType })} />
        </FormControl>
      </Section>

      <Section isDividerNested>
        <CardForm withImage={isStandard} data={data} onChange={onChange} />
      </Section>
    </Content>
  );
};

export default CardEditor;
