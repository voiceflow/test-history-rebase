import type { BaseModels } from '@voiceflow/base-types';
import { createMultiAdapter } from 'bidirectional-adapter';

import type { CanvasTemplate } from '@/models';

const canvasTemplateAdapter = createMultiAdapter<BaseModels.Version.CanvasTemplate, CanvasTemplate>(
  ({ id, name, color, nodeIDs }) => ({ id, name, color, nodeIDs }),
  ({ id, name, color, nodeIDs }) => ({ id, name, color, nodeIDs })
);

export default canvasTemplateAdapter;
