import React from 'react';
import { Alert } from 'reactstrap';
import { withProps } from 'recompose';

import ButtonGroupRouter from '@/components/ButtonGroupRouter';
import VariableText from '@/components/VariableText';
import { ReminderType } from '@/constants';
import { Content, Section } from '@/containers/CanvasV2/components/BlockEditor';

import ReminderForm from './components/ReminderForm';

const REMINDER_ROUTES = [
  {
    label: 'Timer',
    value: ReminderType.TIMER,
    component: ReminderForm,
  },
  {
    label: 'Scheduled',
    value: ReminderType.SCHEDULED,
    component: withProps({ withDate: true })(ReminderForm),
  },
];

function ReminderEditor({ data, onChange }) {
  const updateText = (text) => onChange({ text });
  const updateReminderType = (reminderType) => onChange({ reminderType });

  return (
    <Content>
      <Section>
        <label className="mt-0">Reminder Type</label>
        <ButtonGroupRouter selected={data.reminderType} routes={REMINDER_ROUTES} routeProps={{ data, onChange }} onChange={updateReminderType} />
        <label>Reminder</label>
        <VariableText className="editor" value={data.text} placeholder="Walk the dog, do the dishes, etc." onChange={updateText} />
        <Alert className="mt-3">
          If failing, try prompting the user with the <b>Permission</b> block and a message
        </Alert>
      </Section>
    </Content>
  );
}

export default ReminderEditor;
