declare module '@voiceflow/common' {
  type PlatformMap<T> = Record<'alexa' | 'google', T>;

  namespace constants {
    type Slot = {
      type: PlatformMap<string | null>;
      label: string;
      locales: PlatformMap<string[] | null>;
    };

    const slots: Slot[];
  }
}
