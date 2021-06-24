import { Input } from '@voiceflow/ui';
import React from 'react';

import Section from '@/components/Section';
import { useManager } from '@/hooks';
import { Content, FormControl } from '@/pages/Canvas/components/Editor';
import PrefixedVariableSelect from '@/pages/Canvas/components/PrefixedVariableSelect';
import LineItemsSection from '@/pages/Canvas/managers/Integration/components/CustomApi/components/LineItemsSection';
import MetaDataLineItem from '@/pages/Canvas/managers/Integration/components/MetaDataLineItem';

const EventMappingFactory = () => ({ variable: '', path: '' });

function EventEditor({ data, onChange }) {
  const { items, onAdd, mapManaged } = useManager(data.mappings, (mappings) => onChange({ mappings }), { EventMappingFactory });

  return (
    <Content>
      <Section>
        <FormControl label="Event Request Name" contentBottomUnits={0}>
          <Input
            value={data.requestName}
            onChange={(e) => onChange({ requestName: e.target.value })}
            placeholder="e.g. AudioPlayer.PlaybackStopped"
          />
        </FormControl>
      </Section>
      <LineItemsSection header="Request Mapping" onAdd={onAdd} dividers isDividerNested>
        {mapManaged((map, { key, onUpdate, onRemove }) => (
          <MetaDataLineItem
            prefix="PATH"
            onlyItem={items.length === 1}
            keyPlaceholder="Enter object path"
            onRemove={onRemove}
            onUpdate={(path) => onUpdate({ path })}
            value={map.path}
            key={key}
          >
            <PrefixedVariableSelect value={map.var} onChange={(value) => onUpdate({ var: value })} />
          </MetaDataLineItem>
        ))}
      </LineItemsSection>
    </Content>
  );
}

export default EventEditor;
