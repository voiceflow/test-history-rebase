export const PersonaModel = {
  GPT_3: 'gpt_3',
  GPT_3_5: 'gpt_3.5',
  GPT_4: 'gpt_4',
};

export type PersonaModel = (typeof PersonaModel)[keyof typeof PersonaModel];
