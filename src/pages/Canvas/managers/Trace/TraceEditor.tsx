import React from 'react';
import { useSelector } from 'react-redux';

import AceEditor, { ACE_EDITOR_OPTIONS } from '@/components/AceEditor';
import Box from '@/components/Box';
import ChatWithUsLink from '@/components/ChatLink';
import DraggableList, { DeleteComponent } from '@/components/DraggableList';
import Section, { SectionToggleVariant, SectionVariant } from '@/components/Section';
import TextArea from '@/components/TextArea';
import { focusedNodeSelector } from '@/ducks/creator';
import { useManager, useToggle } from '@/hooks';
import { NodeData } from '@/models/NodeData';
import { Content, Controls } from '@/pages/Canvas/components/Editor';
import EditorSection from '@/pages/Canvas/components/EditorSection';
import { EngineContext } from '@/pages/Canvas/contexts';
import { NodeEditorPropsType } from '@/pages/Canvas/managers/types';

import { DraggableItem, HelpTooltip } from './components';

const TraceEditor: React.FC<NodeEditorPropsType<NodeData.Trace>> = ({ data, onChange }) => {
  const [name, setName] = React.useState(data.name);
  const [value, setValue] = React.useState(data.body);
  const [isDragging, toggleDragging] = useToggle(false);

  const engine = React.useContext(EngineContext)!;
  const focusedNode = useSelector(focusedNodeSelector)!;

  const updatePaths = React.useCallback((paths) => onChange({ paths }), [onChange]);
  const onRemovePath = React.useCallback((_, index) => engine.port.remove(focusedNode.ports.out[index]), [engine.port, focusedNode.ports.out]);
  const updateDefaultPath = React.useCallback((index: number) => updatePaths(data.paths.map((path, i) => ({ ...path, isDefault: i === index }))), [
    onChange,
    data.paths,
  ]);

  const { items, onAdd, onRemove, mapManaged, onReorder } = (useManager as any)(data.paths, updatePaths, {
    factory: () => ({ label: '' }),
    autosave: false,
    handleRemove: onRemovePath,
  });

  const reorderPaths = React.useCallback(
    (from, to) => {
      onReorder(from, to);
      engine.port.reorder(focusedNode.id, from + 1, to + 1);
    },
    [onReorder, engine.port, focusedNode.id]
  );

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
            helpTitle: 'Having trouble?',
            helpMessage: (
              <>
                <ChatWithUsLink>Live chat</ChatWithUsLink> with someone on the Voiceflow team.
              </>
            ),
          }}
        />
      )}
      hideFooter={isDragging}
      fillHeight
    >
      <Section>
        <TextArea value={name} onChange={(e) => setName(e.target.value)} onBlur={() => onChange({ name })} placeholder="Enter Trace Name" />
      </Section>
      <EditorSection
        namespace="trace"
        header="Trace Body"
        headerToggle
        variant={SectionVariant.SECONDARY}
        collapseVariant={SectionToggleVariant.ARROW}
        isDividerNested
        borderBottom
      >
        <Box pb={20}>
          <AceEditor
            placeholder="Enter trace code here"
            value={value}
            onChange={setValue}
            onBlur={() => onChange({ body: value })}
            name="code"
            mode="json"
            hasBorder
            setOptions={ACE_EDITOR_OPTIONS}
          />
        </Box>
      </EditorSection>
      <DraggableList
        type="trace-editor"
        items={items}
        itemProps={{ updateDefaultPath }}
        onDelete={onRemove}
        onReorder={reorderPaths}
        onEndDrag={toggleDragging}
        mapManaged={mapManaged}
        onStartDrag={toggleDragging}
        itemComponent={DraggableItem}
        deleteComponent={DeleteComponent}
        partialDragItem
        previewComponent={DraggableItem}
        withContextMenuDelete
        fullHeight={false}
      />
    </Content>
  );
};

export default TraceEditor;
