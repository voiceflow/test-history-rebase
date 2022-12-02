import { Nullable } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import * as Session from '@/ducks/session';
import * as Tracking from '@/ducks/tracking';
import * as VersionV2 from '@/ducks/versionV2';
import { useSelector, useTrackingEvents } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { OptionalSectionConfig } from '@/pages/Canvas/managers/types';
import { getPlatformNoMatchFactory } from '@/utils/noMatch';

import { Section } from './components';
import { PATH } from './constants';

interface NoMatchConfigOptions {
  canRemove?: boolean;
  step?: Tracking.NoMatchStepType;
  step_id?: string;
}

export const useConfig = ({ canRemove = true, step, step_id }: NoMatchConfigOptions = {}): OptionalSectionConfig => {
  const editor = EditorV2.useEditor<{ noMatch?: Nullable<Realtime.NodeData.NoMatch> }>();

  const [trackingEvents] = useTrackingEvents();
  const projectID = useSelector(Session.activeProjectIDSelector)!;
  const workspaceID = useSelector(Session.activeWorkspaceIDSelector);

  const defaultVoice = useSelector(VersionV2.active.voice.defaultVoiceSelector);

  const { noMatch } = editor.data;

  const onRemove = canRemove ? () => editor.onChange({ noMatch: null }) : undefined;

  const addNoMatch = () => {
    trackingEvents.trackNoMatchCreated({
      workspace_id: workspaceID,
      project_id: projectID,
      creation_type: Tracking.NoMatchCreationType.STEP,
      step_type: step,
      step_id,
    });

    return getPlatformNoMatchFactory(editor.projectType)({ defaultVoice });
  };

  return {
    option: {
      label: noMatch ? 'Remove no match' : 'Add no match',
      onClick: () => editor.onChange({ noMatch: noMatch ? null : addNoMatch() }),
    },
    section: !!noMatch && <Section onClick={() => editor.goToNested(PATH)} onRemove={onRemove} />,
  };
};
