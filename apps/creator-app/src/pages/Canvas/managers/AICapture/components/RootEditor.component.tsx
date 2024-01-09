import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, SectionV2, Toggle } from '@voiceflow/ui';
import React from 'react';

import * as Tracking from '@/ducks/tracking';
import { useAllEntitiesSelector, useOnOpenEntityCreateModal, useOnOpenEntityEditModal } from '@/hooks/entity.hook';
import { useIndexedMapManager } from '@/hooks/mapManager';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import EntitySelector from '@/pages/Canvas/managers/CaptureV2/components/EntitySelector';
import { NoReplyV2 } from '@/pages/Canvas/managers/components';
import * as AI from '@/pages/Canvas/managers/components/AI';
import { useIntentScope } from '@/pages/Canvas/managers/hooks';

import Rule from './Rule.component';

const RootEditor: React.FC<{}> = () => {
  const { data, onChange } = EditorV2.useEditor<Realtime.NodeData.AICapture, Realtime.NodeData.AICaptureBuiltInPorts>();

  const entitiesManager = useIndexedMapManager(data.entities, (entities) => onChange({ entities }), {
    factory: () => '',
    minItems: 1,
    maxItems: 3,
  });

  const rulesManager = useIndexedMapManager(data.rules, (rules) => onChange({ rules }), {
    maxItems: 3,
    factory: () => '',
  });

  const exitSceneriosManager = useIndexedMapManager(data.exitScenerios, (exitScenerios) => onChange({ exitScenerios }), {
    maxItems: 3,
    factory: () => '',
  });

  const onOpenEntityEditModal = useOnOpenEntityEditModal();
  const onOpenEntityCreateModal = useOnOpenEntityCreateModal();

  const usedEntities = React.useMemo(() => new Set(data.entities), [data.entities]);

  const entities = useAllEntitiesSelector();
  const options = React.useMemo(
    () =>
      entities.map((entity) => ({
        id: entity.id,
        label: entity.name,
        name: entity.name,
      })),
    [entities, data.entities]
  );

  const intentScopeOption = useIntentScope({ data, onChange });
  const noReplyConfig = NoReplyV2.useConfig({ step: data });

  return (
    <EditorV2
      header={<EditorV2.DefaultHeader />}
      footer={
        <EditorV2.DefaultFooter>
          <EditorV2.FooterActionsButton actions={[intentScopeOption, noReplyConfig.option]} />
        </EditorV2.DefaultFooter>
      }
    >
      <SectionV2.Sticky>
        {({ sticked }) => (
          <SectionV2.Header sticky sticked={sticked}>
            <SectionV2.Title bold>Entities</SectionV2.Title>
            <SectionV2.AddButton onClick={entitiesManager.onAdd} disabled={entitiesManager.isMaxReached} />
          </SectionV2.Header>
        )}
      </SectionV2.Sticky>

      <SectionV2.Content bottomOffset={0.5}>
        {entitiesManager.map(({ item }, { key, isLast, onUpdate, onRemove }) => (
          <Box key={key} pb={isLast ? 16 : 12}>
            <SectionV2.ListItem action={<SectionV2.RemoveButton onClick={onRemove} disabled={entitiesManager.isMinReached} />}>
              <EntitySelector
                inDropdownSearch={false}
                options={options.filter((option) => !usedEntities.has(option.id) || option.id === item)}
                value={item}
                onSelect={(entityID) => onUpdate({ item: entityID || '' })}
                onCreate={async (name = '') => {
                  try {
                    const entity = await onOpenEntityCreateModal({
                      name,
                      folderID: null,
                      creationType: Tracking.CanvasCreationType.EDITOR,
                    });

                    onUpdate({ item: entity.id });
                  } catch {
                    // model is closed
                  }
                }}
                onEdit={item ? () => onOpenEntityEditModal({ entityID: item }) : undefined}
              />
            </SectionV2.ListItem>
          </Box>
        ))}
      </SectionV2.Content>
      <AI.PromptSettingsEditor value={data} onValueChange={onChange} showSystem={false} />

      <SectionV2.Divider />

      <SectionV2.Header>
        <SectionV2.Title bold>Rules</SectionV2.Title>
        <SectionV2.AddButton onClick={rulesManager.onAdd} disabled={rulesManager.isMaxReached} />
      </SectionV2.Header>

      <SectionV2.Content bottomOffset={0.5}>
        {rulesManager.map(({ item }, { key, isLast, onUpdate, onRemove }) => (
          <Rule key={key} value={item} onUpdate={(item) => onUpdate({ item })} onRemove={onRemove} isLast={isLast} placeholder="Add rule" />
        ))}
      </SectionV2.Content>

      <SectionV2.Divider />

      <SectionV2.Header>
        <SectionV2.Title bold>Exit scenerios</SectionV2.Title>
        <SectionV2.AddButton onClick={exitSceneriosManager.onAdd} disabled={exitSceneriosManager.isMaxReached} />
      </SectionV2.Header>

      <SectionV2.Content bottomOffset={0.5}>
        {exitSceneriosManager.map(({ item }, { key, onUpdate, onRemove, isLast }) => (
          <Rule key={key} value={item} onUpdate={(item) => onUpdate({ item })} onRemove={onRemove} isLast={isLast} placeholder="Add exit scenerio" />
        ))}
      </SectionV2.Content>

      {!!exitSceneriosManager.size && (
        <>
          <SectionV2.Divider />
          <SectionV2.SimpleSection onClick={() => onChange({ exitPath: !data.exitPath })}>
            <SectionV2.Title>Exit scenario path</SectionV2.Title>
            <Toggle size={Toggle.Size.EXTRA_SMALL} checked={!!data.exitPath} />
          </SectionV2.SimpleSection>
        </>
      )}

      {noReplyConfig.section}
    </EditorV2>
  );
};

export default RootEditor;
