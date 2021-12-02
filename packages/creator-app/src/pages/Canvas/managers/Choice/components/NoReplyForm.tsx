import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { NoReplyEditor } from '@/pages/Canvas/components/NoReply';
import { NodeEditorPropsType } from '@/pages/Canvas/managers/types';

const NoReplyForm: React.FC<NodeEditorPropsType<Realtime.NodeData.Interaction>> = ({ data, onChange, pushToPath }) =>
  data.noReply ? <NoReplyEditor noReply={data.noReply} onChange={(noReply) => onChange({ noReply })} pushToPath={pushToPath} /> : null;

export default NoReplyForm;
