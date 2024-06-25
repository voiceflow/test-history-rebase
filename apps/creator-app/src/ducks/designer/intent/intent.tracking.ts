import type { IntentClassificationSettings } from '@voiceflow/dtos';

import { cmsTrackingFactory } from '../utils/tracking.util';

const tracker = cmsTrackingFactory('Intent');

export const previewUtteranceFeedback = tracker<{
  type: 'thumbs_up' | 'thumbs_down';
  settings: IntentClassificationSettings;
  utterance: string;
  userIntent?: string;
  llmClassified: Array<{ name: string }>;
  nluClassified: Array<{ name: string; confidence: number }>;
}>('Preview Utterance Feedback');
