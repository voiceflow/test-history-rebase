import { Nullable, Nullish } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { FollowPathEditor } from '@/pages/Canvas/components/FollowPath';

interface NoReplyPathNameEditorProps<T extends { noReply?: Nullish<Realtime.NodeData.NoReply> }> {
  data: T;
  onChange: (data: { noReply: Realtime.NodeData.NoReply }) => void;
}

const NoReplyPathNameEditor = <T extends { noReply?: Nullish<Realtime.NodeData.NoReply> }>({
  data,
  onChange,
}: NoReplyPathNameEditorProps<T>): Nullable<React.ReactElement> =>
  data.noReply ? (
    <FollowPathEditor name={data.noReply.pathName} onChange={(name) => data.noReply && onChange({ noReply: { ...data.noReply, pathName: name } })} />
  ) : null;

export default NoReplyPathNameEditor;
