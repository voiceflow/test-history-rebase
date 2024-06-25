import type { EmptyObject, Nullable } from '@voiceflow/common';
import type * as Realtime from '@voiceflow/realtime-sdk';
import { createDividerMenuItemOption } from '@voiceflow/ui';
import React from 'react';

import * as GPT from '@/components/GPT';
import * as Tracking from '@/ducks/tracking';
import * as VersionV2 from '@/ducks/versionV2';
import { useSelector, useTrackingEvents } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import type { OptionalSectionConfig } from '@/pages/Canvas/managers/types';
import { getPlatformNoMatchFactory } from '@/utils/noMatch';

import { Section } from './components';
import type { RootEditorLocationState } from './components/RootEditor';
import { PATH } from './constants';

interface NoMatchConfigOptions {
  step?: Realtime.NodeData<EmptyObject>;
  canRemove?: boolean;
}

export const useConfig = ({ canRemove = true, step }: NoMatchConfigOptions = {}): OptionalSectionConfig => {
  const gptResponseGen = GPT.useGPTGenFeatures();
  const [trackingEvents] = useTrackingEvents();

  const editor = EditorV2.useEditor<{ noMatch?: Nullable<Realtime.NodeData.NoMatch> }>();

  const defaultVoice = useSelector(VersionV2.active.voice.defaultVoiceSelector);

  const { noMatch } = editor.data;

  const onOpen = (state?: RootEditorLocationState) => editor.goToNested({ path: PATH, state: { ...state } });

  const onRemove = canRemove ? () => editor.onChange({ noMatch: null }) : undefined;

  const onAdd = async (locationState?: RootEditorLocationState) => {
    trackingEvents.trackNoMatchCreated({
      stepID: step?.nodeID,
      stepType: step?.type,
      creationType: Tracking.NoMatchCreationType.STEP,
    });

    await editor.onChange({
      noMatch: getPlatformNoMatchFactory(editor.projectType)({
        defaultVoice,
        reprompts: locationState?.autogenerate ? [] : [''],
      }),
    });

    onOpen(locationState);
  };

  return {
    option:
      gptResponseGen.isEnabled && !noMatch
        ? {
            label: 'No match',
            options: [
              { label: 'Add manually', onClick: () => onAdd() },
              createDividerMenuItemOption(),
              { label: 'Generate 1 response', onClick: () => onAdd({ autogenerate: true, autogenerateQuantity: 1 }) },
              { label: 'Generate 3 responses', onClick: () => onAdd({ autogenerate: true, autogenerateQuantity: 3 }) },
              { label: 'Generate 5 responses', onClick: () => onAdd({ autogenerate: true, autogenerateQuantity: 5 }) },
            ],
          }
        : {
            label: noMatch ? 'Remove no match' : 'Add no match',
            onClick: noMatch ? onRemove : () => onAdd(),
          },
    section: !!noMatch && <Section onClick={() => onOpen()} onRemove={onRemove} />,
  };
};
