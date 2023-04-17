import { Nullable, Nullish } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { FollowPathEditor } from '@/pages/Canvas/components/FollowPath';

interface NoMatchPathNameEditorProps<T extends { noMatch?: Nullish<Realtime.NodeData.NoMatch> }> {
  data: T;
  onChange: (data: { noMatch: Realtime.NodeData.NoMatch }) => void;
}

const NoMatchPathNameEditor = <T extends { noMatch?: Nullish<Realtime.NodeData.NoMatch> }>({
  data,
  onChange,
}: NoMatchPathNameEditorProps<T>): Nullable<React.ReactElement> =>
  data.noMatch ? (
    <FollowPathEditor name={data.noMatch.pathName} onChange={(name) => data.noMatch && onChange({ noMatch: { ...data.noMatch, pathName: name } })} />
  ) : null;

export default NoMatchPathNameEditor;
