import { SLOT_REGEXP } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Button, Input, SectionV2, SvgIcon, toast, useLinkedState, withInputBlur } from '@voiceflow/ui';
import _cloneDeep from 'lodash/cloneDeep';
import React from 'react';

import client from '@/client';
import { useGenOptions } from '@/components/GPT/hooks';
import * as Documentation from '@/config/documentation';
import { useMapManager } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';
import { deepVariableReplacement, deepVariableSearch } from '@/ModalsV2/modals/Canvas/Integration/SendRequest/utils';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { Divider } from '@/pages/Canvas/managers/Integration/components/Api/Form/components/styles';
import { NodeEditorV2 } from '@/pages/Canvas/managers/types';

import AISetPreview from './components/Preview';
import Set from './components/Set';

const MAX_ITEMS = 5;

const Editor: NodeEditorV2<Realtime.NodeData.AISet, Realtime.NodeData.AIResponseBuiltInPorts> = ({ data, onChange }) => {
  const [label, setLabel] = useLinkedState(data.label);

  const variablePrompt = ModalsV2.useModal(ModalsV2.VariablePrompt);
  const previewModal = ModalsV2.useModal(AISetPreview);

  const [isLoading, setIsLoading] = React.useState(false);

  const mapManager = useMapManager(data.sets, (sets) => onChange({ sets }), {
    factory: () => ({ prompt: '', variable: null }),
    maxItems: MAX_ITEMS,
  });

  const hasContent = data.sets.some((set) => !!set.prompt);

  const getGenOptions = useGenOptions();

  const onPreview = async () => {
    if (isLoading) return;

    const sets = _cloneDeep(data.sets).filter((set) => !!set.prompt.trim());

    const variablesToFill = sets.flatMap(({ prompt }) => deepVariableSearch(prompt, SLOT_REGEXP));
    if (variablesToFill.length) {
      const filledVariables = await variablePrompt.openVoid({ variablesToFill });
      if (!filledVariables) return;

      sets.forEach((set) => {
        set.prompt = deepVariableReplacement(set.prompt, filledVariables, SLOT_REGEXP);
      });
    }

    try {
      setIsLoading(true);

      const results = await Promise.all(
        sets.map(async ({ prompt, variable }) => {
          const { result } = await client.gptGen.generativeResponse({ ...getGenOptions(), prompt });
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
    </EditorV2>
  );
};

export default Editor;
