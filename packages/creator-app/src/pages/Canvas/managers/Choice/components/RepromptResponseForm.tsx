import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import NoMatch from '@/pages/Canvas/components/NoMatch';
import { NodeEditorPropsType } from '@/pages/Canvas/managers/types';

const RepromptResponseForm: React.FC<NodeEditorPropsType<Realtime.NodeData.Interaction>> = ({ data, onChange, pushToPath }) => (
  <NoMatch noMatches={data.else} onChange={(noMatches) => onChange({ else: noMatches })} pushToPath={pushToPath} />
);

export default RepromptResponseForm;
