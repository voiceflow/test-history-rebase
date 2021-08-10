import { Input } from '@voiceflow/ui';
import React from 'react';

import ListManager from '@/components/ListManager';
import OverflowMenu from '@/components/OverflowMenu';
import Section from '@/components/Section';
import SlotSelect from '@/components/SlotSelect';
import VariableSelect from '@/components/VariableSelect';
import * as Documentation from '@/config/documentation';
import { CUSTOM_SLOT_TYPE } from '@/constants';
import { NodeData } from '@/models';
import { Content, Controls, FormControl } from '@/pages/Canvas/components/Editor';
import { useNoReplyOptionSection } from '@/pages/Canvas/managers/hooks';
import { NodeEditorPropsType } from '@/pages/Canvas/managers/types';

import HelpTooltip from './components/HelpTooltip';

const SEARCH_QUERY_SLOT = 'AMAZON.SearchQuery';

const SlotSelectComponent = SlotSelect as React.FC<any>;
const VariableSelectComponent = VariableSelect as React.FC<any>;

const CaptureEditor: React.FC<NodeEditorPropsType<NodeData.Capture>> = ({ data, onChange, pushToPath }) => {
  const updateSlot = React.useCallback((slot) => onChange({ slot }), [onChange]);
  const onSelectVariable = React.useCallback((variable) => onChange({ variable }), [onChange]);

  const optionsFilter = React.useCallback((slotType) => slotType?.value !== SEARCH_QUERY_SLOT, []);

  const [noReplyOption, noReplySection] = useNoReplyOptionSection({ data, onChange, pushToPath });

  return (
    <Content
      footer={() => (
        <Controls
          menu={<OverflowMenu placement="top-end" options={[noReplyOption]} />}
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
          <SlotSelectComponent value={data.slot} onChange={updateSlot} filter={optionsFilter} />
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
                  value={value!}
                  onKeyPress={(event) => {
                    if (event.key === 'Enter') {
                      // eslint-disable-next-line xss/no-mixed-html
                      onAdd((event.target as HTMLInputElement).value);
                      onChange('');
                    }
                  }}
                  onChange={(e) => onChange(e.target.value)}
                />
              )}
              renderItem={(item, { onUpdate }) => (
                <Input value={item} onChange={(e) => onUpdate(e.target.value)} placeholder="Enter Entity Content Example" />
              )}
            />
          </FormControl>
        )}
        <FormControl label="Capture Input to" contentBottomUnits={0}>
          <VariableSelectComponent value={data.variable} onChange={onSelectVariable} />
        </FormControl>
      </Section>

      {noReplySection}
    </Content>
  );
};

export default CaptureEditor;
