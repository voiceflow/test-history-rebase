import React from 'react';

import Input from '@/components/Input';
import ListManager from '@/components/ListManager';
import OverflowMenu from '@/components/OverflowMenu';
import Section from '@/components/Section';
import SlotSelect from '@/components/SlotSelect';
import VariableSelect from '@/components/VariableSelect';
import * as Documentation from '@/config/documentation';
import { CUSTOM_SLOT_TYPE, PlatformType } from '@/constants';
import { Content, Controls, FormControl } from '@/pages/Canvas/components/Editor';
import NoReplyResponse, { repromptFactory } from '@/pages/Canvas/components/NoReplyResponse';
import SuggestionChips, { chipFactory } from '@/pages/Canvas/components/SuggestionChips';
import { useIsPlatform } from '@/pages/Skill/hooks';

import HelpTooltip from './components/HelpTooltip';

const SEARCH_QUERY_SLOT = 'AMAZON.SearchQuery';

function CaptureEdtitor({ data, onChange, pushToPath }) {
  const updateSlot = React.useCallback((slot) => onChange({ slot }), [onChange]);
  const onSelectVariable = React.useCallback((variable) => onChange({ variable }), [onChange]);

  const hasNoReplyResponse = !!data.reprompt;
  const toggleReprompt = React.useCallback(
    () => onChange({ reprompt: hasNoReplyResponse ? null : repromptFactory() }),
    [hasNoReplyResponse, onChange]
  );

  const hasChips = !!data.chips;
  const toggleChips = React.useCallback(() => onChange({ chips: hasChips ? null : chipFactory() }), [hasChips, onChange]);

  const optionsFilter = React.useCallback((slotType) => slotType?.value !== SEARCH_QUERY_SLOT, []);

  const isAlexa = useIsPlatform(PlatformType.ALEXA);

  return (
    <Content
      footer={() => (
        <Controls
          menu={
            <OverflowMenu
              placement="top-end"
              options={[
                {
                  label: hasNoReplyResponse ? 'Remove No Reply Response' : 'Add  No Reply Response',
                  onClick: toggleReprompt,
                },
                ...(!isAlexa
                  ? [
                      {
                        label: hasChips ? 'Remove Suggestion Chips' : 'Add Suggestion Chips',
                        onClick: toggleChips,
                      },
                    ]
                  : []),
              ]}
            />
          }
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
      {hasNoReplyResponse && <NoReplyResponse pushToPath={pushToPath} />}
      {hasChips && <SuggestionChips pushToPath={pushToPath} />}
    </Content>
  );
}

export default CaptureEdtitor;
