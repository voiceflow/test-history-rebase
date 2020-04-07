declare module '@voiceflow/common' {
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
  }
}
