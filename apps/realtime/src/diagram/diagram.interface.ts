import { BaseModels } from '@voiceflow/base-types';
import { Optional } from 'utility-types';

export type PrimitiveDiagram = Optional<BaseModels.Diagram.Model, '_id' | 'diagramID'>;
