import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { FollowPathEditor } from '@/pages/Canvas/components/FollowPath';
import { NodeEditorPropsType } from '@/pages/Canvas/managers/types';

const NoMatchPathNameForm: React.FC<NodeEditorPropsType<Realtime.NodeData.Buttons>> = ({ data, onChange }) => (
  <FollowPathEditor name={data.else.pathName} onChange={(name) => onChange({ else: { ...data.else, pathName: name } })} />
);

export default NoMatchPathNameForm;
