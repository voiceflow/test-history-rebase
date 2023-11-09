import type { PersonaOverride } from '@voiceflow/dtos';
import type { Normalized } from 'normal-store';

export const STATE_KEY = 'persona_override';

export interface PersonaOverrideState extends Normalized<PersonaOverride> {}
