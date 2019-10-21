import React from 'react';

import ButtonGroupRouter from '@/components/ButtonGroupRouter';
import { Content, Section } from '@/containers/CanvasV2/components/BlockEditor';
import IntentManager from '@/containers/IntentManager';
import SlotManager from '@/containers/SlotManager';

import IntentForm from './components/IntentForm';

const IntentRoute = {
  SELECT: 'select',
  INTENT: 'intents',
  SLOT: 'slots',
};

const INTENT_ROUTES = [
  {
    label: 'Select',
    value: IntentRoute.SELECT,
    component: IntentForm,
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

function IntentEditor({ data, onChange }) {
  const [activeRoute, updateRoute] = React.useState(IntentRoute.SELECT);

  return (
    <Content>
      <Section>
        <ButtonGroupRouter selected={activeRoute} onChange={updateRoute} routes={INTENT_ROUTES} routeProps={{ data, onChange }} />
      </Section>
    </Content>
  );
}

export default IntentEditor;
