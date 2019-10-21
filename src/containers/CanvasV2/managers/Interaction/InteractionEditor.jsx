import React from 'react';

import ButtonGroupRouter from '@/components/ButtonGroupRouter';
import { Content, Section } from '@/containers/CanvasV2/components/BlockEditor';
import IntentManager from '@/containers/IntentManager';
import SlotManager from '@/containers/SlotManager';

import ChoiceManager from './components/InteractionChoiceManager';

const IntentRoute = {
  CHOICE: 'choices',
  INTENT: 'intents',
  SLOT: 'slots',
};

const INTERACTION_ROUTES = [
  {
    label: 'Choices',
    value: IntentRoute.CHOICE,
    component: ChoiceManager,
  },
  {
    label: 'Intents',
    value: IntentRoute.INTENT,
    component: IntentManager,
  },
  {
    label: 'Slots',
    value: IntentRoute.SLOT,
    component: SlotManager,
  },
];

function InteractionEditor({ data, onChange }) {
  const [activeRoute, updateRoute] = React.useState(IntentRoute.CHOICE);

  return (
    <Content>
      <Section>
        <ButtonGroupRouter selected={activeRoute} onChange={updateRoute} routes={INTERACTION_ROUTES} routeProps={{ data, onChange }} />
      </Section>
    </Content>
  );
}

export default InteractionEditor;
