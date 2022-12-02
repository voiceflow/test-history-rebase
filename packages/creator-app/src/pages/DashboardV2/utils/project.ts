import * as Realtime from '@voiceflow/realtime-sdk';
import dayjs from 'dayjs';

import * as ProjectV2 from '@/ducks/projectV2';

export const getProjectStatusAndMembers = ({
  project,
  activeViewers,
  getMemberByIDSelector,
}: {
  project?: Realtime.AnyProject;
  activeViewers?: ProjectV2.DiagramViewer[];
  getMemberByIDSelector: (options: { creatorID: number }) => Realtime.WorkspaceMember | null;
}) => {
  const lastUpdateByMember = project?.canvasUpdatedByCreatorID ? getMemberByIDSelector({ creatorID: project.canvasUpdatedByCreatorID }) : null;
  const lastUpdatedByMemberList = lastUpdateByMember ? [lastUpdateByMember] : [];

  return {
    status: activeViewers?.length ? 'Active' : project?.canvasUpdatedAt && dayjs(project.canvasUpdatedAt).fromNow(),
    members: activeViewers?.length ? activeViewers : lastUpdatedByMemberList,
  };
};
