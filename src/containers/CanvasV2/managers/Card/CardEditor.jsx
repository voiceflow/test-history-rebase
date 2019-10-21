import React from 'react';
import { withProps } from 'recompose';

import ButtonGroupRouter from '@/components/ButtonGroupRouter';
import VariableText from '@/components/VariableText';
import { CardType } from '@/constants';
import { Content, Section } from '@/containers/CanvasV2/components/BlockEditor';

import CardForm from './components/CardForm';

const CARD_ROUTES = [
  {
    label: 'Simple',
    value: CardType.SIMPLE,
    component: CardForm,
  },
  {
    label: 'Standard',
    value: CardType.STANDARD,
    component: withProps({ withImage: true })(CardForm),
  },
];

function CardEditor({ data, onChange }) {
  const onUpdateContent = (content) => onChange({ content });
  const updateCardType = (cardType) => onChange({ cardType });
  const isSimple = data.cardType === CardType.SIMPLE;

  return (
    <Content>
      <Section>
        <label>Card Type</label>
        <ButtonGroupRouter selected={data.cardType} routes={CARD_ROUTES} routeProps={{ data, onChange }} onChange={updateCardType} />
        <label>{isSimple ? 'Content' : 'Text'}</label>
        <VariableText className="editor" value={data.content} placeholder="Add content to your card here" onChange={onUpdateContent} />
      </Section>
    </Content>
  );
}

export default CardEditor;
