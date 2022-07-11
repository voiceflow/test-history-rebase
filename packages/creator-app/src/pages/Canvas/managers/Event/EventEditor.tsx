import { AlexaNode } from '@voiceflow/alexa-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Input } from '@voiceflow/ui';
import React from 'react';

import Section from '@/components/Section';
import { useMapManager } from '@/hooks';
import { Content, FormControl } from '@/pages/Canvas/components/Editor';
import PrefixedVariableSelect from '@/pages/Canvas/components/PrefixedVariableSelect';
import LineItemsSection from '@/pages/Canvas/managers/Integration/components/CustomApi/components/LineItemsSection';
import MetaDataLineItem from '@/pages/Canvas/managers/Integration/components/MetaDataLineItem';
import { NodeEditor } from '@/pages/Canvas/managers/types';

const EventMappingFactory = (): AlexaNode.Event.Mapping => ({ var: '', path: '' });

const EventEditor: NodeEditor<Realtime.NodeData.Event, Realtime.NodeData.EventBuiltInPorts> = ({ data, onChange }) => {
  const mapManager = useMapManager(data.mappings, (mappings) => onChange({ mappings }), { factory: EventMappingFactory });

  return (
    <Content>
      <Section>
        <FormControl label="Event Request Name" contentBottomUnits={0}>
          <Input value={data.requestName} onChangeText={(value) => onChange({ requestName: value })} placeholder="e.g. AudioPlayer.PlaybackStopped" />
        </FormControl>
      </Section>
      <LineItemsSection header="Request Mapping" onAdd={() => mapManager.onAdd()} dividers>
        {mapManager.map((map, { key, onUpdate, onRemove }) => (
          <MetaDataLineItem
            key={key}
            value={map.path}
            onlyItem={mapManager.isOnlyItem}
            onUpdate={(path: string) => onUpdate({ path })}
            onRemove={onRemove}
            keyPlaceholder="Enter object path"
          >
            <PrefixedVariableSelect value={map.var} onChange={(value) => onUpdate({ var: value })} />
          </MetaDataLineItem>
        ))}
      </LineItemsSection>
    </Content>
  );
};

export default EventEditor;
