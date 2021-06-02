import { NodeData } from '@/models';
import { NoReplyResponseForm } from '@/pages/Canvas/components/NoReplyResponse';
import { ChipForm } from '@/pages/Canvas/components/SuggestionChips';

import { NodeManagerConfig } from '../types';
import CaptureEditor from './CaptureEditor';
import CaptureStep from './CaptureStep';
import { NODE_CONFIG } from './constants';

const EDITORS_BY_PATH = {
  noReplyResponse: NoReplyResponseForm,
  chips: ChipForm,
};

const CaptureManager: NodeManagerConfig<NodeData.Capture> = {
  ...NODE_CONFIG,

  tip: 'Capture what the user says into a variable',
  label: 'Capture',
  chips: true,
  reprompt: true,

  step: CaptureStep,
  editor: CaptureEditor as React.FC,
  editorsByPath: EDITORS_BY_PATH,
};

export default CaptureManager;
