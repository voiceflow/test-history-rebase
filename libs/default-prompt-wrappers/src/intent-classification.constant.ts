export const DEFAULT_INTENT_CLASSIFICATION_PROMPT_WRAPPER_CODE = `export default async function main(args) {
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
\${args.intents.map((intent) => \`d: \${intent.description} a: \${intent.name}\`)}
You are given an utterance and you have to classify it into an action based on the description. Only respond with the action class. If the utterance does not match any of action descriptions, output None.
Now take a deep breath and classify the following utterance.
u:\${args.query} a:
\`;

  return { prompt };
}`;
