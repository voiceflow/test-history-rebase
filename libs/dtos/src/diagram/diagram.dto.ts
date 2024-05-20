import { z } from 'zod';

import { DiagramMenuItemDTO } from './diagram-menu-item.dto';
import { DiagramNodeDTO } from './diagram-node.dto';
import { DiagramType } from './diagram-type.enum';

export const DiagramDTO = z
  .object({
    _id: z.string(),

    name: z.string(),

    type: z.nativeEnum(DiagramType).optional(),

    zoom: z.number(),

    nodes: z.record(DiagramNodeDTO),

    offsetX: z.number(),

    offsetY: z.number(),

    modified: z.number(),

    children: z.array(z.string()).optional(),

    diagramID: z.string(),

    versionID: z.string(),

    creatorID: z.number(),

    variables: z.array(z.string()),

    menuItems: z.array(DiagramMenuItemDTO).optional(),

    /**
     * @deprecated use `menuItems` instead
     */
    menuNodeIDs: z.array(z.string()).optional().describe('@deprecated in favor of menuItems'),

    /**
     * @deprecated use `menuNodeIDs` instead
     */
    intentStepIDs: z.array(z.string()).optional().describe('@deprecated in favor of menuNodeIDs'),
  })
  .strict();

export type Diagram = z.infer<typeof DiagramDTO>;
