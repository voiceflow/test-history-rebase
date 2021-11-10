import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Input } from '@voiceflow/ui';
import React from 'react';
import { useSelector } from 'react-redux';

import Divider from '@/components/Divider';
import Section, { SectionToggleVariant } from '@/components/Section';
import TextArea from '@/components/TextArea';
import { focusedNodeSelector } from '@/ducks/creator';
import { useManager } from '@/hooks';
import { Content, Controls } from '@/pages/Canvas/components/Editor';
import EditorSection from '@/pages/Canvas/components/EditorSection';
import { EngineContext } from '@/pages/Canvas/contexts';
import { NodeEditorPropsType } from '@/pages/Canvas/managers/types';

import { HelpTooltip, Path } from './components';

const ActionEditor: React.FC<NodeEditorPropsType<Realtime.NodeData.Trace>> = ({ data, onChange }) => {
  const [name, setName] = React.useState(data.name);
  const [value, setValue] = React.useState(data.body);

  const engine = React.useContext(EngineContext)!;
  const focusedNode = useSelector(focusedNodeSelector)!;

  const updatePaths = React.useCallback((paths) => onChange({ paths }), [onChange]);
  const onRemovePath = React.useCallback((_, index) => engine.port.remove(focusedNode.ports.out[index]), [engine.port, focusedNode.ports.out]);

  const { items, onAdd, mapManaged } = useManager(data.paths, updatePaths, {
    factory: () => ({ label: '' }),
    autosave: false,
    handleRemove: onRemovePath,
  });

  const updateDefaultPath = (i: number) => {
    mapManaged((item: any, { index, onUpdate }: any) => onUpdate({ ...item, isDefault: i === index }));
  };

  const addPath = React.useCallback(
    async (scrollToBottom) => {
      onAdd();
      await engine.port.add(focusedNode.id, {});
      scrollToBottom();
    },
    [engine.port, focusedNode.id, items.length, onAdd]
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
          iconProps={{ color: '#3A5999' }}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => onChange({ name })}
          placeholder="Name Custom Action step"
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
