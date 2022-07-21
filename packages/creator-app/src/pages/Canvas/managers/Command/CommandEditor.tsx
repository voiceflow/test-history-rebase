import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import * as ProjectV2 from '@/ducks/projectV2';
import { useFeature, useSelector } from '@/hooks';

import { NodeEditor } from '../types';
import { CommandEditorOld, CommandEditorV2 } from './components';

const CommandEditor: NodeEditor<Realtime.NodeData.Command, {}> = (props) => {
  const topicsAndComponents = useFeature(Realtime.FeatureFlag.TOPICS_AND_COMPONENTS);
  const isTopicsAndComponentsVersion = useSelector(ProjectV2.active.isTopicsAndComponentsVersionSelector);

  return topicsAndComponents.isEnabled && isTopicsAndComponentsVersion ? <CommandEditorV2 {...props} /> : <CommandEditorOld {...props} />;
};

export default CommandEditor;
