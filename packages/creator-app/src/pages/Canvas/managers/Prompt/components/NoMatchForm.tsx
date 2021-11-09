import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import NoMatch from '@/pages/Canvas/components/NoMatch';
import { NodeEditorPropsType } from '@/pages/Canvas/managers/types';

const NoMatchForm: React.FC<NodeEditorPropsType<Realtime.NodeData.Prompt>> = ({ data, onChange, pushToPath }) => (
  <NoMatch noMatches={data.noMatchReprompt} onChange={(noMatches) => onChange({ noMatchReprompt: noMatches })} pushToPath={pushToPath} />
);

export default NoMatchForm;
