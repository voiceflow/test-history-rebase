import React from 'react';

import { NodeData } from '@/models';
import { NoMatchPathEditor } from '@/pages/Canvas/components/NoMatchPath';
import { NodeEditorPropsType } from '@/pages/Canvas/managers/types';

const NoMatchPathNameForm: React.FC<NodeEditorPropsType<NodeData.Buttons>> = ({ data, onChange }) => (
  <NoMatchPathEditor name={data.else.pathName} onChange={(name) => onChange({ else: { ...data.else, pathName: name } })} />
);

export default NoMatchPathNameForm;
