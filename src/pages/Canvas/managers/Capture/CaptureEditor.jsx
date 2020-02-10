import React from 'react';

import SlotSelect from '@/components/SlotSelect';
import Input from '@/componentsV2/Input';
import ListManagerV2 from '@/componentsV2/ListManagerV2';
import OverflowMenu from '@/componentsV2/OverflowMenu';
import VariableSelect from '@/componentsV2/VariableSelect';
import { CUSTOM_SLOT_TYPE } from '@/constants';
import { Content, Controls, FormControl, Section } from '@/pages/Canvas/components/Editor';
import NoReplyResponse, { repromptFactory } from '@/pages/Canvas/components/NoReplyResponse';

import HelpTooltip from './components/HelpTooltip';

const DOCUMENTATION_LINK = 'https://docs.voiceflow.com/voiceflow-documentation/untitled/capture-block';

function CaptureEdtitor({ data, onChange, pushToPath }) {
  const updateSlot = React.useCallback((slot) => onChange({ slot }), [onChange]);
  const onSelectVariable = React.useCallback((variable) => onChange({ variable }), [onChange]);

  const hasReprompt = !!data.reprompt;
  const toggleReprompt = React.useCallback(() => onChange({ reprompt: hasReprompt ? null : repromptFactory() }), [hasReprompt, onChange]);

  return (
    <Content
      footer={() => (
        <Controls
          menu={
            <OverflowMenu
              placement="top-end"
              options={[
                {
                  label: hasReprompt ? 'Remove No Reply Response' : 'Add  No Reply Response',
                  onClick: toggleReprompt,
                },
              ]}
            />
          }
          tutorial={{
            content: <HelpTooltip />,
            blockType: data.type,
            helpMessage: (
              <>
                Check out further documentation on the capture block{' '}
                <a href={DOCUMENTATION_LINK} rel="noopener noreferrer" target="_blank">
                  here
                </a>
                .
              </>
            ),
          }}
        />
      )}
    >
      <Section>
        <FormControl label="Input Type">
          <SlotSelect value={data.slot} onChange={updateSlot} />
        </FormControl>
        {data.slot === CUSTOM_SLOT_TYPE && (
          <FormControl>
            <ListManagerV2
              items={data.examples}
              addToStart
              onUpdate={(examples) => onChange({ examples })}
              renderForm={({ value, onAdd, onChange }) => (
                <Input
                  placeholder="Enter user reply"
                  value={value}
                  onKeyPress={(event) => {
                    if (event.key === 'Enter') {
                      onAdd(event.target.value);
                      onChange('');
                    }
                  }}
                  onChange={(e) => onChange(e.target.value)}
                />
              )}
              renderItem={(item, { onUpdate }) => (
                <Input value={item} onChange={(e) => onUpdate(e.target.value)} placeholder="Enter Slot Content Example" />
              )}
            />
          </FormControl>
        )}
        <FormControl label="Capture Input to" contentBottomUnits={0}>
          <VariableSelect value={data.variable} onChange={onSelectVariable} />
        </FormControl>
      </Section>
      {hasReprompt && <NoReplyResponse pushToPath={pushToPath} />}
    </Content>
  );
}

export default CaptureEdtitor;
