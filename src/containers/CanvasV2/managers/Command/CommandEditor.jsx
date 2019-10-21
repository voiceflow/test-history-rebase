import React from 'react';

import ButtonGroupRouter from '@/components/ButtonGroupRouter';
import { Content, Section } from '@/containers/CanvasV2/components/BlockEditor';
import IntentManager from '@/containers/IntentManager';
import SlotManager from '@/containers/SlotManager';

import CommandForm from './components/CommandForm';

const CommandRoute = {
  COMMAND: 'command',
  INTENT: 'intents',
  SLOT: 'slots',
};

const COMMAND_ROUTES = [
  {
    label: 'Command',
    value: CommandRoute.COMMAND,
    component: CommandForm,
  },
  {
    label: 'Intents',
    value: CommandRoute.INTENT,
    component: IntentManager,
  },
  {
    label: 'Slots',
    value: CommandRoute.SLOT,
    component: SlotManager,
  },
];

function CommandEditor({ data, onChange }) {
  const [activeRoute, updateRoute] = React.useState(CommandRoute.COMMAND);

  return (
    <Content>
      <Section>
        <ButtonGroupRouter selected={activeRoute} onChange={updateRoute} routes={COMMAND_ROUTES} routeProps={{ data, onChange }} />
      </Section>
    </Content>
  );
}

export default CommandEditor;
