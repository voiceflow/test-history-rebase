import React from 'react';

import { NodeData } from '@/models';
import { NoMatchPathEditor } from '@/pages/Canvas/components/NoMatchPath';
import { NodeEditorPropsType } from '@/pages/Canvas/managers/types';

const NoMatchPathNameForm: React.FC<NodeEditorPropsType<NodeData.Prompt>> = ({ data, onChange }) => (
  <NoMatchPathEditor
    name={data.noMatchReprompt.pathName}
    onChange={(name) => onChange({ noMatchReprompt: { ...data.noMatchReprompt, pathName: name } })}
  />
);

export default NoMatchPathNameForm;
