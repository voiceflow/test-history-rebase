import { Nullable, Nullish } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import NoReplyForm, { NoReplyFormProps } from './NoReplyForm';

interface NoReplyEditorProps<T extends { noReply?: Nullish<Realtime.NodeData.NoReply> }> extends Omit<NoReplyFormProps, 'noReply' | 'onChange'> {
  data: T;
  onChange: (data: { noReply: Realtime.NodeData.NoReply }) => Promise<void>;
}

const NoReplyEditor = <T extends { noReply?: Nullish<Realtime.NodeData.NoReply> }>({
  data,
  onChange,
  ...props
}: NoReplyEditorProps<T>): Nullable<React.ReactElement> =>
  data.noReply ? <NoReplyForm {...props} noReply={data.noReply} onChange={(noReply) => onChange({ noReply })} /> : null;

export default NoReplyEditor;
