import { BaseUtils } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Button, Input, SectionV2, SvgIcon, toast, useLinkedState, withInputBlur } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import { useGenOptions } from '@/components/GPT/hooks';
import * as Documentation from '@/config/documentation';
import { useMapManager } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';
import { useFillVariables } from '@/ModalsV2/modals/VariablePrompt';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import * as AI from '@/pages/Canvas/managers/components/AI';
import { Divider } from '@/pages/Canvas/managers/Integration/components/Api/Form/components/styles';
import { NodeEditorV2 } from '@/pages/Canvas/managers/types';

import AISetPreview from './components/Preview';
import Set from './components/Set';

const MAX_ITEMS = 5;

const Editor: NodeEditorV2<Realtime.NodeData.AISet, Realtime.NodeData.AIResponseBuiltInPorts> = ({ data, onChange }) => {
  const [label, setLabel] = useLinkedState(data.label);
  const fillVariables = useFillVariables();

  const previewModal = ModalsV2.useModal(AISetPreview);

  const [isLoading, setIsLoading] = React.useState(false);

  const mapManager = useMapManager(data.sets, (sets) => onChange({ sets }), {
    factory: () => ({ prompt: '', variable: null, mode: BaseUtils.ai.PROMPT_MODE.PROMPT }),
    maxItems: MAX_ITEMS,
  });

  const hasContent = data.sets.some((set) => set.mode !== BaseUtils.ai.PROMPT_MODE.MEMORY && !!set.prompt);

  const getGenOptions = useGenOptions();

  const onPreview = async () => {
    if (isLoading) return;

    const context = await fillVariables({ sets: data.sets.filter((set) => !!set.prompt.trim()), system: data.system });
    if (!context) return;

    try {
      setIsLoading(true);

      const results = await Promise.all(
        context.sets.map(async ({ prompt, variable }) => {
          const { result } = await client.gptGen.generativeResponse({ ...data, ...getGenOptions(), system: context.system, prompt });
          return { variable, result };
        })
      );

      previewModal.open({ results });
    } catch {
      toast.error('Unable to generate response preview');
    } finally {
      setIsLoading(false);
    }
  };

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
          onBlur={() => onChange({ label })}
          placeholder="Enter set label"
          onEnterPress={withInputBlur()}
          onChangeText={setLabel}
        />
      </SectionV2.SimpleSection>

      <SectionV2.Divider />
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
            <Set set={item} onUpdate={onUpdate} onRemove={onRemove} removeDisabled={mapManager.size <= 1} />
          </Box>
        ))}
      </SectionV2.Content>

      <SectionV2.Divider />

      <AI.PromptSettings data={data} onChange={onChange} />
    </EditorV2>
  );
};

export default Editor;
