import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { FollowPathEditor } from '@/pages/Canvas/components/FollowPath';
import { NodeEditorPropsType } from '@/pages/Canvas/managers/types';

const NoReplyPathNameForm: React.FC<NodeEditorPropsType<Realtime.NodeData.ChoiceOld>> = ({ data: { noReply }, onChange }) =>
  noReply ? <FollowPathEditor name={noReply.pathName ?? ''} onChange={(name) => onChange({ noReply: { ...noReply, pathName: name } })} /> : null;

export default NoReplyPathNameForm;
