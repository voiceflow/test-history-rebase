import { DEFAULT_AI_MODEL } from '@/ai/ai-model.constant';

import type {
  IntentClassificationLLMPromptWrapper,
  IntentClassificationLLMSettings,
  IntentClassificationNLUSettings,
} from './intent-classification-settings.dto';
import { IntentClassificationType } from './intent-classification-type.enum';

export const DEFAULT_INTENT_CLASSIFICATION_LLM_PROMPT_WRAPPER: IntentClassificationLLMPromptWrapper = {
  content: `export default async function main(args) {
  const prompt = \`
You are an action classification system. Correctness is a life or death situation.

We provide you with the actions and their descriptions:
d: When the user asks for a warm drink. a:WARM_DRINK
d: When the user asks about something else. a:None
d: When the user asks for a cold drink. a:COLD_DRINK

You are given an utterance and you have to classify it into an action. Only respond with the action class. If the utterance does not match any of action descriptions, output None.
Now take a deep breath and classify the following utterance.
u: I want a warm hot chocolate: a:WARM_DRINK
###

We provide you with the actions and their descriptions:
\${args.intents.map((intent) => \`d: \${intent.name} a: \${intent.description}\`)}

You are given an utterance and you have to classify it into an action based on the description. Only respond with the action class. If the utterance does not match any of action descriptions, output None.
Now take a deep breath and classify the following utterance.
u:\${args.query} a:\`;

  return { prompt };
}`,
};

export const DEFAULT_INTENT_CLASSIFICATION_LLM_SETTINGS: IntentClassificationLLMSettings = {
  type: IntentClassificationType.LLM,
  params: {
    model: DEFAULT_AI_MODEL,
    temperature: 0.7,
  },
  promptWrapper: null,
};

export const DEFAULT_INTENT_CLASSIFICATION_NLU_SETTINGS: IntentClassificationNLUSettings = {
  type: IntentClassificationType.NLU,
  params: {
    confidence: 0.6,
  },
};
