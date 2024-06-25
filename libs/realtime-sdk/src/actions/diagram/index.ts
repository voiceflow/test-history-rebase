import { createCRUDActions } from '@realtime-sdk/actions/utils';
import { TEMPLATE_DIAGRAM_KEY } from '@realtime-sdk/constants';
import type { Diagram } from '@realtime-sdk/models';
import type { BaseVersionPayload } from '@realtime-sdk/types';
import type { PrimitiveDiagram } from '@realtime-sdk/utils/diagram';
import { Utils } from '@voiceflow/common';
import type { Required } from 'utility-types';

import { diagramType } from './utils';

export * as awareness from './awareness';
export * as sharedNodes from './sharedNodes';
export * as utils from './utils';
export * as viewport from './viewport';

const diagramTemplateDiagramType = Utils.protocol.typeFactory(diagramType(TEMPLATE_DIAGRAM_KEY));

// crud
export const crud = createCRUDActions<Diagram, BaseVersionPayload, Pick<Diagram, 'name'>>(diagramType);

// template diagram
export interface TemplateCreatePayload extends BaseVersionPayload {
  template: Required<Partial<PrimitiveDiagram>, 'name'>;
}

export const templateCreate = Utils.protocol.createAsyncAction<TemplateCreatePayload, Diagram>(
  diagramTemplateDiagramType('CREATE')
);
