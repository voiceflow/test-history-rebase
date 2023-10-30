import { createSmartMultiAdapter } from 'bidirectional-adapter';

import type { CMSTabularKeyRemap } from '@/postgres/common';
import { PostgresCMSTabularJSONAdapter, ref } from '@/postgres/common';
import type { EntityObject, ToJSONWithForeignKeys } from '@/types';

import { FlowEntity } from '../flow';
import { UserStubEntity } from '../stubs/user.stub';
import type { StoryEntity } from './story.entity';

export const StoryJSONAdapter = createSmartMultiAdapter<
  EntityObject<StoryEntity>,
  ToJSONWithForeignKeys<StoryEntity>,
  [],
  [],
  CMSTabularKeyRemap<[['flow', 'flowID'], ['assignee', 'assigneeID']]>
>(
  ({ flow, assignee, ...data }) => ({
    ...PostgresCMSTabularJSONAdapter.fromDB(data),

    ...(flow !== undefined && { flowID: flow?.id ?? null }),

    ...(assignee !== undefined && { assigneeID: assignee?.id ?? null }),
  }),
  ({ flowID, assigneeID, ...data }) => ({
    ...PostgresCMSTabularJSONAdapter.toDB(data),

    ...(assigneeID !== undefined && { assignee: assigneeID ? ref(UserStubEntity, assigneeID) : null }),

    ...(flowID !== undefined &&
      data.environmentID !== undefined && {
        flow: flowID ? ref(FlowEntity, { id: flowID, environmentID: data.environmentID }) : null,
      }),
  })
);
