import type { AlexaNode } from '@voiceflow/alexa-types';
import type * as Realtime from '@voiceflow/realtime-sdk';
import { Input } from '@voiceflow/ui';
import React from 'react';

import { Add } from '@/components/InteractiveIcon';
import Section, { SectionVariant } from '@/components/Section';
import { useMapManager } from '@/hooks';
import { Content, FormControl } from '@/pages/Canvas/components/Editor';
import PrefixedVariableSelect from '@/pages/Canvas/components/PrefixedVariableSelect';
import type { NodeEditor } from '@/pages/Canvas/managers/types';

import MetaDataLineItem from './MetaDataLineItem';

const EventMappingFactory = (): AlexaNode.Event.Mapping => ({ var: '', path: '' });

const EventEditor: NodeEditor<Realtime.NodeData.Event, Realtime.NodeData.EventBuiltInPorts> = ({ data, onChange }) => {
  const mapManager = useMapManager(data.mappings, (mappings) => onChange({ mappings }), {
    factory: EventMappingFactory,
  });

  return (
    <Content>
      <Section>
        <FormControl label="Event Request Name" contentBottomUnits={0}>
          <Input
            value={data.requestName}
            onChangeText={(value) => onChange({ requestName: value })}
            placeholder="e.g. AudioPlayer.PlaybackStopped"
          />
        </FormControl>
      </Section>

      <Section
        variant={SectionVariant.SUBSECTION}
        header="Request Mapping"
        status={<Add onClick={() => mapManager.onAdd()} />}
      >
        <FormControl contentBottomUnits={mapManager.isEmpty ? 0 : 1}>
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
        </FormControl>
      </Section>
    </Content>
  );
};

export default EventEditor;
