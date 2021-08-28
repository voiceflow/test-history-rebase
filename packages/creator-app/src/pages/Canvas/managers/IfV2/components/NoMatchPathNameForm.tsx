import React from 'react';

import { NodeData } from '@/models';
import NoMatchPathName from '@/pages/Canvas/components/NoMatchPathName';
import { NodeEditorPropsType } from '@/pages/Canvas/managers/types';

const NoMatchPathNameForm: React.FC<NodeEditorPropsType<NodeData.IfV2>> = ({ data, onChange, pushToPath }) => (
  <NoMatchPathName noMatch={data.noMatch} pushToPath={pushToPath} onChange={(noMatch) => onChange({ noMatch })} />
);

export default NoMatchPathNameForm;
