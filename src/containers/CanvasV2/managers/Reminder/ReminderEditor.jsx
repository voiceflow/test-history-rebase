import React from 'react';

import RadioGroup from '@/components/RadioGroup';
import Section from '@/componentsV2/Section';
import { Content, Controls, FormControl } from '@/containers/CanvasV2/components/Editor';

import { HelpMessage, HelpTooltip } from './components';
import { REMINDER_ROUTES } from './constants';

function ReminderEditor({ data, onChange }) {
  const { reminderType, name } = data;
  const ReminderComponent = REMINDER_ROUTES.find((reminder) => reminder.id === reminderType).component;

  const updateReminderType = React.useCallback((reminderType) => onChange({ reminderType }), [onChange]);

  return (
    <Content
      footer={() => (
        <Controls
          tutorial={{
            blockType: data.type,
            content: <HelpTooltip />,
            helpTitle: 'Having Trouble?',
            helpMessage: <HelpMessage />,
          }}
          anchor="More Info"
        />
      )}
    >
      <Section>
        <FormControl label="Reminder Type" />
        <RadioGroup options={REMINDER_ROUTES} checked={reminderType} name={name} onChange={updateReminderType} />
      </Section>

      <ReminderComponent data={data} onChange={onChange} />
    </Content>
  );
}

export default ReminderEditor;
