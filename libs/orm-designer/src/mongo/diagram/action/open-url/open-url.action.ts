import { z } from 'zod';

import { Markup } from '@/common/dtos/markup.dto';

import { NodePortsWithNext } from '../../node/node.dto';
import { NodeType } from '../../node/node-type.enum';
import { Action, BaseActionData } from '../action.dto';
import { OpenURLTarget } from './open-url-target.enum';

export const OpenURLActionData = BaseActionData.extend({
  url: Markup,
  target: z.nativeEnum(OpenURLTarget),
});

export type OpenURLActionData = z.infer<typeof OpenURLActionData>;

export const OpenURLAction = Action(NodeType.ACTION__OPEN_URL__V3, OpenURLActionData, NodePortsWithNext);

export type OpenURLAction = z.infer<typeof OpenURLAction>;
