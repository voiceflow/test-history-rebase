import type { BaseText } from '@voiceflow/base-types';
import * as Platform from '@voiceflow/platform-config';
import type * as Realtime from '@voiceflow/realtime-sdk';
import { Box, SectionV2, UploadV2 } from '@voiceflow/ui';
import React from 'react';

import SlateEditable from '@/components/SlateEditable';
import { SlateTextInput } from '@/components/SlateInputs';
import VariablesInput from '@/components/VariablesInput';
import { useActiveProjectTypeConfig, useImageDimensions } from '@/hooks';
import { FormControl } from '@/pages/Canvas/components/Editor';
import type { NodeEditorV2Props } from '@/pages/Canvas/managers/types';

import Buttons from './Buttons';

export interface CardV2Props {
  item: Realtime.NodeData.CardV2;
  editor: NodeEditorV2Props<Realtime.NodeData.CardV2, Realtime.NodeData.CardV2BuiltInPorts>;
  onUpdate: (value: Partial<Realtime.NodeData<Realtime.NodeData.CardV2>>, save?: boolean | undefined) => Promise<void>;
}

const CardV2: React.FC<CardV2Props> = ({ item, editor, onUpdate }) => {
  const dimensions = useImageDimensions({ url: item.imageUrl });
  const isVoiceProject = editor.projectType === Platform.Constants.ProjectType.VOICE;

  const config = useActiveProjectTypeConfig();

  const onChange =
    <Key extends keyof Realtime.NodeData.CardV2>(field: Key) =>
    (value: Realtime.NodeData.CardV2[Key]) =>
      onUpdate(
        {
          [field]: value,
        },
        true
      );

  return (
    <Box bg="#fdfdfd" pt={20}>
      <SectionV2.Content topOffset={0.5} bottomOffset={3}>
        <FormControl>
          <UploadV2.Image
            rootDropAreaProps={{ pb: '4px' }}
            renderInput={VariablesInput.renderInput}
            value={item.imageUrl}
            onChange={onChange('imageUrl')}
            ratio={dimensions?.ratio}
          />
        </FormControl>
        <FormControl>
          <VariablesInput
            value={item.title}
            placeholder="Enter card title, { to add variable"
            onBlur={({ text }) => onChange('title')(text.trim())}
          />
        </FormControl>
        <FormControl contentBottomUnits={0}>
          {isVoiceProject ? (
            <VariablesInput
              value={item.description as string}
              onBlur={({ text }) => onChange('description')(text)}
              multiline
              placeholder="Enter card description, { to add variable"
              newLineOnEnter
            />
          ) : (
            <SlateTextInput
              value={(item.description as BaseText.SlateTextValue) || SlateEditable.EditorAPI.getEmptyState()}
              options={config.project.chat.toolbarOptions}
              onBlur={onChange('description')}
              placeholder="Enter card description, { to add variable"
            />
          )}
        </FormControl>
      </SectionV2.Content>
      {!isVoiceProject && (
        <>
          <SectionV2.Divider inset />
          <Buttons.Section
            buttons={item.buttons}
            editor={editor}
            onUpdate={({ buttons = [] }) =>
              onUpdate({ buttons } as Partial<Realtime.NodeData<Realtime.NodeData.CardV2>>, true)
            }
          />
        </>
      )}
    </Box>
  );
};

export default CardV2;
