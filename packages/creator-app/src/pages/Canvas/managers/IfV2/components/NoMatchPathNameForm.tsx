import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import NoMatchPathName from '@/pages/Canvas/components/NoMatchPathName';
import { NodeEditorPropsType } from '@/pages/Canvas/managers/types';

const NoMatchPathNameForm: React.FC<NodeEditorPropsType<Realtime.NodeData.IfV2>> = ({ data, onChange, pushToPath }) => (
  <NoMatchPathName noMatch={data.noMatch} pushToPath={pushToPath} onChange={(noMatch) => onChange({ noMatch })} />
);

export default NoMatchPathNameForm;
