import { BaseUtils } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Button, Input, SectionV2, SvgIcon, useLinkedState, withInputBlur } from '@voiceflow/ui';
import React from 'react';

import { useKnowledgeBase } from '@/components/GPT/hooks/feature';
import RadioGroup from '@/components/RadioGroup';
import * as Documentation from '@/config/documentation';
import { useMapManager } from '@/hooks/mapManager';
import { useFillVariables } from '@/hooks/variable';
import * as ModalsV2 from '@/ModalsV2';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import * as AI from '@/pages/Canvas/managers/components/AI';
import { Divider } from '@/pages/Canvas/managers/Integration/components/Api/Form/components/styles';

import AISetPreview from './components/Preview';
import Set from './components/Set';

const MAX_ITEMS = 5;

const Editor: React.FC = () => {
  const editor = EditorV2.useEditor<Realtime.NodeData.AISet, Realtime.NodeData.AISetBuiltInPorts>();

  const previewModal = ModalsV2.useModal(AISetPreview);
  const fillVariables = useFillVariables();

  const getCompletion = AI.useSourceCompletion();

  const [label, setLabel] = useLinkedState(editor.data.label);
  const { source = BaseUtils.ai.DATA_SOURCE.DEFAULT } = editor.data;
  const [isLoading, setIsLoading] = React.useState(false);

  const mapManager = useMapManager(editor.data.sets, (sets) => editor.onChange({ sets }), {
    factory: () => ({ prompt: '', variable: null, mode: BaseUtils.ai.PROMPT_MODE.PROMPT }),
    maxItems: MAX_ITEMS,
  });

  const hasContent = React.useMemo(
    () => editor.data.sets.some((set) => set.mode !== BaseUtils.ai.PROMPT_MODE.MEMORY && !!set.prompt),
    [editor.data.sets]
  );

  const onPreview = async () => {
    if (isLoading) return;

    const context = await fillVariables({ sets: editor.data.sets.filter((set) => !!set.prompt.trim()), system: editor.data.system });
    if (!context) return;

    try {
      setIsLoading(true);

      const results = await Promise.all(
        context.sets.map(async ({ prompt, variable }) => {
          const output = await getCompletion(source, {
            ...editor.data,
            mode: BaseUtils.ai.PROMPT_MODE.PROMPT,
            system: context.system,
            prompt,
          });

          if (source === BaseUtils.ai.DATA_SOURCE.KNOWLEDGE_BASE && !output) {
            return { variable, output: BaseUtils.ai.KNOWLEDGE_BASE_NOT_FOUND };
          }

          return { variable, output };
        })
      );

      previewModal.open({ results });
    } finally {
      setIsLoading(false);
    }
  };

  const knowledgeBase = useKnowledgeBase();

  return (
    <EditorV2
      header={<EditorV2.DefaultHeader />}
      footer={
        <EditorV2.DefaultFooter tutorial={Documentation.AI_SET_STEP}>
          <Button variant={Button.Variant.PRIMARY} disabled={!hasContent || isLoading} width={127} onClick={onPreview}>
            {isLoading ? (
              <SvgIcon icon="arrowSpin" spin />
            ) : (
              <Box.Flex gap={12}>
                <SvgIcon icon="aiSmall" />
                Preview
              </Box.Flex>
            )}
          </Button>
        </EditorV2.DefaultFooter>
      }
    >
      <SectionV2.SimpleSection>
        <Input
          value={label}
          onBlur={() => editor.onChange({ label })}
          placeholder="Enter set label"
          onEnterPress={withInputBlur()}
          onChangeText={setLabel}
        />
      </SectionV2.SimpleSection>

      <SectionV2.Divider />

      {knowledgeBase && (
        <>
          <SectionV2.SimpleContentSection
            header={
              <SectionV2.Title bold secondary>
                Data Source
              </SectionV2.Title>
            }
            headerProps={{ bottomUnit: 1.5 }}
            contentProps={{ bottomOffset: 2.5 }}
          >
            <RadioGroup isFlat options={AI.SOURCE_OPTIONS} checked={source} onChange={(source) => editor.onChange({ source })} />
          </SectionV2.SimpleContentSection>

          <SectionV2.Divider inset />
        </>
      )}

      <SectionV2.Sticky>
        {({ sticked }) => (
          <SectionV2.Header sticky sticked={sticked}>
            <SectionV2.Title bold>Set Variables</SectionV2.Title>
            <SectionV2.AddButton onClick={mapManager.onAdd} disabled={mapManager.size >= MAX_ITEMS} />
          </SectionV2.Header>
        )}
      </SectionV2.Sticky>

      <SectionV2.Content bottomOffset={3}>
        {mapManager.map((item, { key, onUpdate, onRemove, isFirst }) => (
          <Box key={key}>
            {!isFirst && <Divider />}
            <Set set={item} source={source} onUpdate={onUpdate} onRemove={onRemove} removeDisabled={mapManager.size <= 1} />
          </Box>
        ))}
      </SectionV2.Content>

      <AI.PromptSettingsEditor data={editor.data} onChange={editor.onChange} />
    </EditorV2>
  );
};

export default Editor;
