import type { Persona } from '@voiceflow/dtos';
import type { Normalized } from 'normal-store';

export const STATE_KEY = 'persona';

export interface PersonaState extends Normalized<Persona> {}
