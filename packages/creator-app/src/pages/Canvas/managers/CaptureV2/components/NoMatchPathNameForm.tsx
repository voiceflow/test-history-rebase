import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { FollowPathEditor } from '@/pages/Canvas/components/FollowPath';
import { NodeEditorPropsType } from '@/pages/Canvas/managers/types';

const NoMatchPathNameForm: React.FC<NodeEditorPropsType<Realtime.NodeData.CaptureV2>> = ({ data, onChange }) =>
  data.noMatch && (
    <FollowPathEditor name={data.noMatch.pathName} onChange={(name) => onChange({ noMatch: { ...data.noMatch, pathName: name } as any })} />
  );

export default NoMatchPathNameForm;
