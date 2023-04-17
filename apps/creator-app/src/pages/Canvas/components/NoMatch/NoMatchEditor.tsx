import { Nullable, Nullish } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import NoMatchForm, { NoMatchFormProps } from './NoMatchForm';

interface NoMatchEditorProps<T extends { noMatch?: Nullish<Realtime.NodeData.NoMatch> }> extends Omit<NoMatchFormProps, 'noMatch' | 'onChange'> {
  data: T;
  onChange: (data: { noMatch: Realtime.NodeData.NoMatch }) => Promise<void>;
}

const NoMatchEditor = <T extends { noMatch?: Nullish<Realtime.NodeData.NoMatch> }>({
  data,
  onChange,
  ...props
}: NoMatchEditorProps<T>): Nullable<React.ReactElement> =>
  data.noMatch ? <NoMatchForm {...props} noMatch={data.noMatch} onChange={(noMatch) => onChange({ noMatch })} /> : null;

export default NoMatchEditor;
