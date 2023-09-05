import type { Diagram } from '@voiceflow/sdk-logux-designer';
import type { Normalized } from 'normal-store';

export const STATE_KEY = 'diagram';

export interface DiagramState extends Normalized<Diagram> {}
