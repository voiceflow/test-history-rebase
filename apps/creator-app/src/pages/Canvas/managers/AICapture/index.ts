import * as Realtime from '@voiceflow/realtime-sdk';

import * as Documentation from '@/config/documentation';
import { NodeCategory } from '@/contexts/SearchContext/types';

import { NodeManagerConfigV2 } from '../types';
import Editor from './components/Editor.component';
import Step from './components/Step/CaptureStep.component';
import { NODE_CONFIG } from './constants';

const AICaptureManager: NodeManagerConfigV2<Realtime.NodeData.AICapture, Realtime.NodeData.AICaptureBuiltInPorts> = {
  ...NODE_CONFIG,

  label: 'Capture AI',

  step: Step,
  editorV2: Editor,

  searchCategory: NodeCategory.USER_INPUT,

  tooltipText: "Capture and record all or part of a user's utterance within a variable.",
  tooltipLink: Documentation.CAPTURE_STEP,
};

export default AICaptureManager;
