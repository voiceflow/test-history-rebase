import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Checkbox, Divider, Input, Tooltip } from '@voiceflow/ui';
import React from 'react';

import Section, { SectionToggleVariant } from '@/components/Section';
import TextArea from '@/components/TextArea';
import { useMapManager } from '@/hooks';
import { Content, Controls } from '@/pages/Canvas/components/Editor';
import EditorSection from '@/pages/Canvas/components/EditorSection';
import { NodeEditor } from '@/pages/Canvas/managers/types';
import THEME from '@/styles/theme';

import { HelpTooltip, Path } from './components';

const ActionEditor: NodeEditor<Realtime.NodeData.Trace> = ({ data, node, engine, onChange }) => {
  const [name, setName] = React.useState(data.name);
  const [value, setValue] = React.useState(data.body);

  const toggleIsBlocking = React.useCallback(() => onChange({ isBlocking: !data.isBlocking }), [data.isBlocking, onChange]);

  const mapManager = useMapManager(data.paths, (paths) => onChange({ paths }), {
    onAdd: () => engine.port.addDynamic(node.id),
    factory: () => ({ label: '', isDefault: false }),
    onRemove: (_, index) => engine.port.removeDynamic(node.ports.out.dynamic[index]),
  });

  const updateDefaultPath = (i: number) => {
    mapManager.map((item, { index, onUpdate }) => {
      onUpdate({ ...item, isDefault: i === index });

      return null;
    });
  };

  return (
    <Content
      footer={({ scrollToBottom }) => (
        <Controls
          options={[
            {
              label: 'Add Path',
              onClick: Utils.functional.chainVoid(mapManager.onAdd, scrollToBottom),
            },
          ]}
          tutorial={{ content: <HelpTooltip />, blockType: data.type }}
        />
      )}
      fillHeight
    >
      <Section>
        <Input
          icon="action"
          value={name}
          onBlur={() => onChange({ name })}
          iconProps={{ color: THEME.buttonIconColors.default }}
          placeholder="Name Custom Action step"
          onChangeText={(value) => setName(value)}
        />
      </Section>
      <Section
        tooltip={
          <>
            <Tooltip.Title>Stop On Action</Tooltip.Title>

            <Tooltip.Section marginBottomUnits={2}>
              If checked, we will stop the conversation on this block until another interact is triggered.
            </Tooltip.Section>
          </>
        }
        header={
          <Checkbox checked={!!data.isBlocking} onChange={toggleIsBlocking}>
            <span>Stop on action</span>
          </Checkbox>
        }
      />
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
        {mapManager.map((item, { index, key, onUpdate, onRemove }) => (
          <Path
            key={key}
            path={item}
            index={index}
            onUpdate={onUpdate}
            onRemove={!mapManager.isOnlyItem ? onRemove : undefined}
            updateDefaultPath={updateDefaultPath}
          />
        ))}
      </Section>
      <Divider offset={0} />
    </Content>
  );
};

export default ActionEditor;
