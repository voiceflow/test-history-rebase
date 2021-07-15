import React from 'react';

import { NodeData } from '@/models';
import NoMatch from '@/pages/Canvas/components/NoMatch';
import { NodeEditorPropsType } from '@/pages/Canvas/managers/types';

const RepromptsForm: React.FC<NodeEditorPropsType<NodeData.Prompt>> = ({ data, onChange, pushToPath }) => (
  <NoMatch noMatches={data.noMatchReprompt} onChange={(noMatches) => onChange({ noMatchReprompt: noMatches })} pushToPath={pushToPath} />
);

export default RepromptsForm;
