import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { NoMatchEditor } from '@/pages/Canvas/components/NoMatch';
import { NodeEditorPropsType } from '@/pages/Canvas/managers/types';

const NoMatchForm: React.FC<NodeEditorPropsType<Realtime.NodeData.Prompt>> = ({ data, onChange, pushToPath }) => (
  <NoMatchEditor noMatch={data.noMatchReprompt} onChange={(noMatch) => onChange({ noMatchReprompt: noMatch })} pushToPath={pushToPath} />
);

export default NoMatchForm;
