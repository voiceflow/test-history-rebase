import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { NoMatchEditor } from '@/pages/Canvas/components/NoMatch';
import { NodeEditorPropsType } from '@/pages/Canvas/managers/types';

const NoMatchForm: React.FC<NodeEditorPropsType<Realtime.NodeData.CaptureV2>> = ({ data, onChange, pushToPath }) =>
  data.noMatch && <NoMatchEditor noMatch={data.noMatch} onChange={(noMatch) => onChange({ noMatch })} pushToPath={pushToPath} />;

export default NoMatchForm;
