import type { PersonaOverride } from '@voiceflow/sdk-logux-designer';
import type { Normalized } from 'normal-store';

export const STATE_KEY = 'persona_override';

export interface PersonaOverrideState extends Normalized<PersonaOverride> {}
