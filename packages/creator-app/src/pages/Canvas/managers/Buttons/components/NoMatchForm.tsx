import React from 'react';

import { NodeData } from '@/models';
import NoMatch from '@/pages/Canvas/components/NoMatch';
import { NodeEditorPropsType } from '@/pages/Canvas/managers/types';

const NoMatchForm: React.FC<NodeEditorPropsType<NodeData.Buttons>> = ({ data, onChange, pushToPath }) => (
  <NoMatch noMatches={data.else} onChange={(noMatches) => onChange({ else: noMatches })} pushToPath={pushToPath} />
);

export default NoMatchForm;
