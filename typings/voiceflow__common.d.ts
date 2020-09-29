declare module '@voiceflow/common' {
  import { Locale } from '@voiceflow/alexa-types';

  type PlatformMap<T> = Record<'alexa' | 'google', T>;

  namespace utils {
    const intent: {
      formatName: (name: string) => string;
      getSlotsForKeys: (keys: unknown[], slots: unknown[], platform: string) => { name: string; type: string }[];
      getUtterancesWithSlotNames: (inputs: unknown[], slots: unknown[], ...args: any[]) => string[];
    };
  }

  namespace constants {
    type Slot = {
      type: PlatformMap<string | null>;
      label: string;
      locales: PlatformMap<string[] | null>;
    };

    type Intent = { name: string; slots?: never; samples: string[] };

    interface LocaleIntents {
      defaults: Intent[];
      built_ins: Intent[];
    }

    type Intents = Record<string, LocaleIntents>;

    const intents: {
      DEFAULT_INTENTS: Intents;
      BUILT_IN_INTENTS_ALEXA: Intent[];
      BUILT_IN_INTENTS_GOOGLE: Intent[];
    };

    const slots: Slot[];

    const locales: {
      LOCALES: {
        US: Locale.EN_US;
      };
      GOOGLE_LOCALES: Record<string, string>;
    };
  }
}
