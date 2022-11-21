import { Nullable } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import * as VersionV2 from '@/ducks/versionV2';
import { useSelector } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { OptionalSectionConfig } from '@/pages/Canvas/managers/types';
import { getPlatformNoMatchFactory } from '@/utils/noMatch';

import { Section } from './components';
import { PATH } from './constants';

interface NoMatchConfigOptions {
  canRemove?: boolean;
}

export const useConfig = ({ canRemove = true }: NoMatchConfigOptions = {}): OptionalSectionConfig => {
  const editor = EditorV2.useEditor<{ noMatch?: Nullable<Realtime.NodeData.NoMatch> }>();

  const defaultVoice = useSelector(VersionV2.active.voice.defaultVoiceSelector);

  const { noMatch } = editor.data;

  const onRemove = canRemove ? () => editor.onChange({ noMatch: null }) : undefined;

  return {
    option: {
      label: noMatch ? 'Remove no match' : 'Add no match',
      onClick: () => editor.onChange({ noMatch: noMatch ? null : getPlatformNoMatchFactory(editor.projectType)({ defaultVoice }) }),
    },
    section: !!noMatch && <Section onClick={() => editor.goToNested(PATH)} onRemove={onRemove} />,
  };
};
