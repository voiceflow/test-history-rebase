import { EmptyObject, Nullable } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { createDividerMenuItemOption } from '@voiceflow/ui';
import React from 'react';

import * as GPT from '@/components/GPT';
import * as Tracking from '@/ducks/tracking';
import * as VersionV2 from '@/ducks/versionV2';
import { useSelector, useTrackingEvents } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { OptionalSectionConfig } from '@/pages/Canvas/managers/types';
import { getPlatformNoReplyFactory } from '@/utils/noReply';

import { Section } from './components';
import type { RootEditorLocationState } from './components/RootEditor';
import { PATH } from './constants';

interface NoReplyConfigOptions {
  step?: Realtime.NodeData<EmptyObject>;
}

export const useConfig = ({ step }: NoReplyConfigOptions = {}): OptionalSectionConfig => {
  const gptResponseGen = GPT.useGPTGenFeatures();
  const [trackingEvents] = useTrackingEvents();

  const editor = EditorV2.useEditor<{ noReply?: Nullable<Realtime.NodeData.NoReply> }>();

  const defaultVoice = useSelector(VersionV2.active.voice.defaultVoiceSelector);

  const { noReply } = editor.data;

  const onOpen = (state?: RootEditorLocationState) => editor.goToNested({ path: PATH, state: { ...state } });

  const onRemove = () => editor.onChange({ noReply: null });

  const onAdd = async (locationState?: RootEditorLocationState) => {
    trackingEvents.trackNoReplyCreated({
      stepID: step?.nodeID,
      stepType: step?.type,
      creationType: Tracking.NoMatchCreationType.STEP,
    });

    await editor.onChange({
      noReply: getPlatformNoReplyFactory(editor.projectType)({ defaultVoice, reprompts: locationState?.autogenerate ? [] : [''] }),
    });

    onOpen(locationState);
  };

  return {
    option:
      gptResponseGen.isEnabled && !noReply
        ? {
            label: 'No reply',
            options: [
              { label: 'Add manually', onClick: () => onAdd() },
              createDividerMenuItemOption(),
              { label: 'Generate 1 response', onClick: () => onAdd({ autogenerate: true, autogenerateQuantity: 1 }) },
              { label: 'Generate 3 responses', onClick: () => onAdd({ autogenerate: true, autogenerateQuantity: 3 }) },
              { label: 'Generate 5 responses', onClick: () => onAdd({ autogenerate: true, autogenerateQuantity: 5 }) },
            ],
          }
        : {
            label: noReply ? 'Remove no reply' : 'Add no reply',
            onClick: noReply ? onRemove : () => onAdd(),
          },
    section: !!noReply && <Section onClick={() => onOpen()} onRemove={() => editor.onChange({ noReply: null })} />,
  };
};
