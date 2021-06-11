import React from 'react';

import Input from '@/components/Input';
import ListManager from '@/components/ListManager';
import OverflowMenu from '@/components/OverflowMenu';
import Section from '@/components/Section';
import SlotSelect from '@/components/SlotSelect';
import VariableSelect from '@/components/VariableSelect';
import * as Documentation from '@/config/documentation';
import { CUSTOM_SLOT_TYPE } from '@/constants';
import { Content, Controls, FormControl } from '@/pages/Canvas/components/Editor';
import { useButtonOption, useNoReplyOption } from '@/pages/Canvas/managers/components/responseOptions';

import HelpTooltip from './components/HelpTooltip';

const SEARCH_QUERY_SLOT = 'AMAZON.SearchQuery';

function CaptureEdtitor({ data, onChange, pushToPath }) {
  const updateSlot = React.useCallback((slot) => onChange({ slot }), [onChange]);
  const onSelectVariable = React.useCallback((variable) => onChange({ variable }), [onChange]);

  const optionsFilter = React.useCallback((slotType) => slotType?.value !== SEARCH_QUERY_SLOT, []);

  const [noReplyOption, noReplyPage] = useNoReplyOption({ data, onChange, pushToPath });
  const [buttonOption, buttonPage] = useButtonOption({ data, onChange, pushToPath });

  return (
    <Content
      footer={() => (
        <Controls
          menu={<OverflowMenu placement="top-end" options={[noReplyOption, buttonOption]} />}
          tutorial={{
            content: <HelpTooltip />,
            blockType: data.type,
            helpMessage: (
              <>
                Check out further documentation on the capture block{' '}
                <a href={Documentation.CAPTURE_STEP} rel="noopener noreferrer" target="_blank">
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
          <SlotSelect value={data.slot} onChange={updateSlot} filter={optionsFilter} />
        </FormControl>
        {data.slot === CUSTOM_SLOT_TYPE && (
          <FormControl>
            <ListManager
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
      {buttonPage}
      {noReplyPage}
    </Content>
  );
}

export default CaptureEdtitor;
