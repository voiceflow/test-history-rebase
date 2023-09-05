import type { Persona } from '@voiceflow/sdk-logux-designer';
import type { Normalized } from 'normal-store';

export const STATE_KEY = 'persona';

export interface PersonaState extends Normalized<Persona> {}
