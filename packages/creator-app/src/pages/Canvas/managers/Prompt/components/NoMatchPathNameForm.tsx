import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import NoMatchPathEditor from '@/pages/Canvas/components/NoMatchPathEditor';
import { NodeEditorPropsType } from '@/pages/Canvas/managers/types';

const NoMatchPathNameForm: React.FC<NodeEditorPropsType<Realtime.NodeData.Prompt>> = ({ data, onChange }) => (
  <NoMatchPathEditor
    name={data.noMatchReprompt.pathName}
    onChange={(name) => onChange({ noMatchReprompt: { ...data.noMatchReprompt, pathName: name } })}
  />
);

export default NoMatchPathNameForm;
