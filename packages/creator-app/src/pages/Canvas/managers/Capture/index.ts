import { NodeData } from '@/models';
import { NoReplyResponseForm } from '@/pages/Canvas/components/NoReplyResponse';
import { ButtonsEditor } from '@/pages/Canvas/components/SuggestionButtons';

import { NodeManagerConfig } from '../types';
import CaptureEditor from './CaptureEditor';
import CaptureStep from './CaptureStep';
import { NODE_CONFIG } from './constants';

const EDITORS_BY_PATH = {
  buttons: ButtonsEditor,
  noReplyResponse: NoReplyResponseForm,
};

const CaptureManager: NodeManagerConfig<NodeData.Capture> = {
  ...NODE_CONFIG,

  tip: 'Capture what the user says into a variable',
  label: 'Capture',
  buttons: true,
  reprompt: true,

  step: CaptureStep,
  editor: CaptureEditor as React.FC,
  editorsByPath: EDITORS_BY_PATH,
};

export default CaptureManager;
