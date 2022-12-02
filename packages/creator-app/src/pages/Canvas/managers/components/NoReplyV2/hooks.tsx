import { Nullable } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import * as Session from '@/ducks/session';
import * as Tracking from '@/ducks/tracking';
import * as VersionV2 from '@/ducks/versionV2';
import { useSelector, useTrackingEvents } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { OptionalSectionConfig } from '@/pages/Canvas/managers/types';
import { getPlatformNoReplyFactory } from '@/utils/noReply';

import { Section } from './components';
import { PATH } from './constants';

interface NoReplyConfigOptions {
  step?: Tracking.NoMatchStepType;
  step_id?: string;
}

export const useConfig = ({ step, step_id }: NoReplyConfigOptions = {}): OptionalSectionConfig => {
  const editor = EditorV2.useEditor<{ noReply?: Nullable<Realtime.NodeData.NoReply> }>();

  const [trackingEvents] = useTrackingEvents();
  const projectID = useSelector(Session.activeProjectIDSelector)!;
  const workspaceID = useSelector(Session.activeWorkspaceIDSelector);

  const defaultVoice = useSelector(VersionV2.active.voice.defaultVoiceSelector);

  const { noReply } = editor.data;

  const addNoReply = () => {
    trackingEvents.trackNoReplyCreated({
      workspace_id: workspaceID,
      project_id: projectID,
      creation_type: Tracking.NoMatchCreationType.STEP,
      step_type: step,
      step_id,
    });

    return getPlatformNoReplyFactory(editor.projectType)({ defaultVoice });
  };

  return {
    option: {
      label: noReply ? 'Remove no reply' : 'Add no reply',
      onClick: () => editor.onChange({ noReply: noReply ? null : addNoReply() }),
    },
    section: !!noReply && <Section onClick={() => editor.goToNested(PATH)} onRemove={() => editor.onChange({ noReply: null })} />,
  };
};
