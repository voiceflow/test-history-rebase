import { NoMatchType } from '@voiceflow/base-types/build/node/utils';
import { define } from 'cooky-cutter';
import { datatype, lorem } from 'faker';

import { NodeData } from '@/models';
import getRandomEnumElement from '@/tests/helpers/getRandomEnumElement';

import { promptChatTypeFactory } from './capture';

// eslint-disable-next-line import/prefer-default-export
export const chatNoMatchesFactory = define<NodeData.ChatNoMatches>({
  pathName: () => lorem.word(),
  randomize: () => datatype.boolean(),
  reprompts: () => [promptChatTypeFactory()],
  type: () => getRandomEnumElement(NoMatchType),
});
