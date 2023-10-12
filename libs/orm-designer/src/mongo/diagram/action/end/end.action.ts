import { z } from 'zod';

import { NodeType } from '../../node/node-type.enum';
import { Action, BaseActionData } from '../action.dto';

export const EndActionData = BaseActionData.extend({
  responseID: z.string().uuid().nullable(),
});

export type EndActionData = z.infer<typeof EndActionData>;

export const EndAction = Action(NodeType.ACTION__END__V3, EndActionData);

export type EndAction = z.infer<typeof EndAction>;
