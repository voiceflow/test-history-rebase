import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import RadioGroup from '@/components/RadioGroup';
import Section from '@/components/Section';
import { Content, Controls, FormControl } from '@/pages/Canvas/components/Editor';
import { NodeEditor } from '@/pages/Canvas/managers/types';

import { HelpMessage, HelpTooltip } from './components';
import { REMINDER_ROUTES } from './constants';

const ReminderEditor: NodeEditor<Realtime.NodeData.Reminder, Realtime.NodeData.ReminderBuiltInPorts> = ({ data, onChange }) => {
  const { reminderType, name } = data;
  const ReminderComponent = REMINDER_ROUTES.find((reminder) => reminder.id === reminderType)!.component;

  const updateReminderType = React.useCallback((reminderType: string) => onChange({ reminderType }), [onChange]);

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
};

export default ReminderEditor;
