import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import * as Project from '@/ducks/project';
import * as Router from '@/ducks/router';
import { useDispatch } from '@/hooks';

interface CreateProjectOptions {
  name: string;
  image: string | null;
  members: Realtime.ProjectMember[];
  aiAssistSettings: BaseModels.Project.AIAssistSettings | null;
}

export const useProjectCreate = () => {
  const createProject = useDispatch(Project.createProject);
  const redirectToCanvas = useDispatch(Router.redirectToCanvas);

  return async ({ name, image, members, aiAssistSettings }: CreateProjectOptions) => {
    const project = await createProject({
      name,
      image: image ?? undefined,
      members,
      aiAssistSettings,
    });

    redirectToCanvas({ versionID: project.versionID });
  };
};
