import { BaseModels } from '@voiceflow/base-types';
import { DFESConstants } from '@voiceflow/google-dfes-types';

// [NLU] TODO: move to nlu configs, should be similar to platform configs
export const EXCLUDED_CONFLICTS_INTENTS: string[] = [DFESConstants.DialogflowESIntent.FALLBACK];

export const transformIntents = (intents: BaseModels.Intent[]) => {
  return intents
    .filter((intent) => !EXCLUDED_CONFLICTS_INTENTS.includes(intent.name))
    .map((intent) => {
      return {
        key: intent.key,
        name: intent.name,
        inputs: intent.inputs.map((input) => ({
          text: input.text,
          slots: input.slots || [],
        })),
        slots: intent?.slots?.length
          ? intent.slots.map((slot) => {
              return {
                id: slot.id,
                dialog: {
                  // TODO: add dialog and confirm
                  prompt: [],
                  confirm: [],
                  utterances: slot.dialog.utterances.map((u) => u.text) as any[],
                  confirmEnabled: slot.dialog.confirmEnabled,
                },
                required: slot.required,
              };
            })
          : [],
      };
    });
};

export const transformSlots = (slots: BaseModels.Slot[]) => {
  return slots.map((slot) => ({
    key: slot.key,
    name: slot.name,
    type: slot.type,
    color: slot.color || '#FFFFFF',
    inputs: slot.inputs,
  }));
};
