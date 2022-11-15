import * as Platform from '@voiceflow/platform-config';
import _isPlainObject from 'lodash/isPlainObject';

import { fmtIntentName } from '@/utils/intent';

export const getUniqSlots = (inputs: Platform.Base.Models.Intent.Input[]): string[] => [...new Set(inputs.flatMap(({ slots }) => slots || []))];

export const intentProcessorFactory =
  (projectConfig: Platform.Base.Type.Config) =>
  ({ inputs = [], slots, ...intent }: Platform.Base.Models.Intent.Model): Platform.Base.Models.Intent.Model => {
    let nextSlots = slots;

    if (!_isPlainObject(slots)) {
      const allKeys = getUniqSlots(inputs);
      const byKey = Object.fromEntries(allKeys.map((id) => [id, projectConfig.utils.intent.slotFactory({ id })]));

      nextSlots = { byKey, allKeys };
    }

    return {
      ...intent,
      slots: nextSlots,
      inputs,
    };
  };

export const applySingleIntentNameFormatting = (
  platform: Platform.Constants.PlatformType,
  intent: Platform.Base.Models.Intent.Model
): Platform.Base.Models.Intent.Model => ({ ...intent, name: fmtIntentName(intent, platform) });

export const applyIntentNameFormatting = (
  platform: Platform.Constants.PlatformType,
  intents: Platform.Base.Models.Intent.Model[]
): Platform.Base.Models.Intent.Model[] => intents.map((intent) => applySingleIntentNameFormatting(platform, intent));
