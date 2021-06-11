import { NodeData } from '@/models';
import { NoReplyResponseForm } from '@/pages/Canvas/components/NoReplyResponse';
import { ButtonsEditor } from '@/pages/Canvas/components/SuggestionButtons';

import { NodeManagerConfig } from '../types';
import { RepromptsForm } from './components';
import { NODE_CONFIG } from './constants';
import PromptEditor from './PromptEditor';
import PromptStep from './PromptStep';

const EDITORS_BY_PATH = {
  buttons: ButtonsEditor,
  reprompts: RepromptsForm,
  noReplyResponse: NoReplyResponseForm,
};

const PromptManager: NodeManagerConfig<NodeData.Prompt> = {
  ...NODE_CONFIG,

  tip: 'Prompts will stop & listen to the user to match an intent',
  label: 'Prompt',

  step: PromptStep,
  editor: PromptEditor,
  editorsByPath: EDITORS_BY_PATH,
};

export default PromptManager;
