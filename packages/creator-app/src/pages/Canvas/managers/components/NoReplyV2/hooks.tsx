import { Nullable } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import * as VersionV2 from '@/ducks/versionV2';
import { useSelector } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { OptionalSectionConfig } from '@/pages/Canvas/managers/types';
import { getPlatformNoReplyFactory } from '@/utils/noReply';

import { Section } from './components';
import { PATH } from './constants';

export const useConfig = (): OptionalSectionConfig => {
  const editor = EditorV2.useEditor<{ noReply?: Nullable<Realtime.NodeData.NoReply> }>();

  const defaultVoice = useSelector(VersionV2.active.voice.defaultVoiceSelector);

  const { noReply } = editor.data;

  return {
    option: {
      label: noReply ? 'Remove no reply' : 'Add no reply',
      onClick: () => editor.onChange({ noReply: noReply ? null : getPlatformNoReplyFactory(editor.projectType)({ defaultVoice }) }),
    },
    section: !!noReply && <Section onClick={() => editor.goToNested(PATH)} onRemove={() => editor.onChange({ noReply: null })} />,
  };
};
