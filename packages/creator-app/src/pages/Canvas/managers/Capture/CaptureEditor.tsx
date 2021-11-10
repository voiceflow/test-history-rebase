import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Input } from '@voiceflow/ui';
import React from 'react';

import ListManager from '@/components/ListManager';
import OverflowMenu from '@/components/OverflowMenu';
import Section from '@/components/Section';
import SlotSelect, { SlotOption } from '@/components/SlotSelect';
import VariableSelect from '@/components/VariableSelect';
import * as Documentation from '@/config/documentation';
import { CUSTOM_SLOT_TYPE } from '@/constants';
import { Content, Controls, FormControl } from '@/pages/Canvas/components/Editor';
import { useNoReplyOptionSection } from '@/pages/Canvas/managers/hooks';
import { NodeEditorPropsType } from '@/pages/Canvas/managers/types';
import { withEnterPress, withTargetValue } from '@/utils/dom';

import { HelpTooltip } from './components';

const SEARCH_QUERY_SLOT = 'AMAZON.SearchQuery';

const CaptureEditor: React.FC<NodeEditorPropsType<Realtime.NodeData.Capture>> = ({ data, onChange, pushToPath }) => {
  const updateSlot = React.useCallback((slot: string) => onChange({ slot }), [onChange]);
  const onSelectVariable = React.useCallback((variable: string) => onChange({ variable }), [onChange]);

  const optionsFilter = React.useCallback((slotType: SlotOption) => slotType?.value !== SEARCH_QUERY_SLOT, []);

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
                  value={value!}
                  onChange={withTargetValue(onChange)}
                  onKeyPress={withEnterPress(Utils.functional.chain(withTargetValue(onAdd), () => onChange('')))}
                />
              )}
              renderItem={(item, { onUpdate }) => (
                <Input value={item} onChange={withTargetValue(onUpdate)} placeholder="Enter Entity Content Example" />
              )}
            />
          </FormControl>
        )}

        <FormControl label="Capture Input to" contentBottomUnits={0}>
          <VariableSelect value={data.variable} onChange={onSelectVariable} />
        </FormControl>
      </Section>

      {noReplySection}
    </Content>
  );
};

export default CaptureEditor;
