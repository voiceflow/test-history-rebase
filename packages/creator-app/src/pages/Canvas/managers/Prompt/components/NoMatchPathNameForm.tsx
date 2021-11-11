import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { FollowPathEditor } from '@/pages/Canvas/components/FollowPath';
import { NodeEditorPropsType } from '@/pages/Canvas/managers/types';

const NoMatchPathNameForm: React.FC<NodeEditorPropsType<Realtime.NodeData.Prompt>> = ({ data, onChange }) => (
  <FollowPathEditor
    name={data.noMatchReprompt.pathName}
    onChange={(name) => onChange({ noMatchReprompt: { ...data.noMatchReprompt, pathName: name } })}
  />
);

export default NoMatchPathNameForm;
