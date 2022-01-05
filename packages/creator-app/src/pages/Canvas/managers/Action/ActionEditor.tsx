import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Input } from '@voiceflow/ui';
import React from 'react';

import Divider from '@/components/Divider';
import Section, { SectionToggleVariant } from '@/components/Section';
import TextArea from '@/components/TextArea';
import { useManager } from '@/hooks';
import { Content, Controls } from '@/pages/Canvas/components/Editor';
import EditorSection from '@/pages/Canvas/components/EditorSection';
import { NodeEditor } from '@/pages/Canvas/managers/types';

import { HelpTooltip, Path } from './components';

const ActionEditor: NodeEditor<Realtime.NodeData.Trace> = ({ data, node, engine, onChange }) => {
  const [name, setName] = React.useState(data.name);
  const [value, setValue] = React.useState(data.body);

  const updatePaths = React.useCallback((paths: Realtime.NodeData.Trace['paths']) => onChange({ paths }), [onChange]);
  const onRemovePath = React.useCallback(
    (_, index: number) => engine.port.removeOutDynamic(node.ports.out.dynamic[index]),
    [engine.port, node.ports.out.dynamic]
  );

  const { items, onAdd, mapManaged } = useManager(data.paths, updatePaths, {
    factory: () => ({ label: '' }),
    autosave: false,
    handleRemove: onRemovePath,
  });

  const updateDefaultPath = (i: number) => {
    mapManaged((item, { index, onUpdate }) => {
      onUpdate({ ...item, isDefault: i === index });

      return null;
    });
  };

  const addPath = React.useCallback(
    async (scrollToBottom) => {
      onAdd();

      await engine.port.addOutDynamic(node.id, {});

      scrollToBottom();
    },
    [engine.port, node.id, items.length, onAdd]
  );

  return (
    <Content
      footer={({ scrollToBottom }) => (
        <Controls
          options={[
            {
              label: 'Add Path',
              onClick: () => addPath(scrollToBottom),
            },
          ]}
          tutorial={{
            content: <HelpTooltip />,
            blockType: data.type,
          }}
        />
      )}
      fillHeight
    >
      <Section>
        <Input
          icon="action"
          value={name}
          onBlur={() => onChange({ name })}
          iconProps={{ color: '#3A5999' }}
          placeholder="Name Custom Action step"
          onChangeText={(value) => setName(value)}
        />
      </Section>
      <EditorSection namespace="action" header="Action Body (optional)" headerToggle collapseVariant={SectionToggleVariant.ARROW} isDividerNested>
        <div>
          <Box pb={20}>
            <TextArea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onBlur={() => onChange({ body: value })}
              minRows={3}
              placeholder="Add Action body payload"
            />
          </Box>
        </div>
      </EditorSection>
      <Section isDividerNested>
        {mapManaged((item: any, { index, key, onUpdate, onRemove }: any) => (
          <Path
            key={key}
            index={index}
            path={item}
            onUpdate={onUpdate}
            onRemove={items.length > 1 ? onRemove : undefined}
            updateDefaultPath={updateDefaultPath}
          />
        ))}
      </Section>
      <Divider offset={0} />
    </Content>
  );
};

export default ActionEditor;
