import React from 'react';

import client from '@/client';
import LoadingGate from '@/components/LoadingGate';
import { FeatureFlag } from '@/config/features';
import * as Modal from '@/ducks/modal';
import * as Project from '@/ducks/project';
import * as Skill from '@/ducks/skill';
import * as Thread from '@/ducks/thread';
import { connect } from '@/hocs';
import { useFeature } from '@/hooks';
import { loadSkill } from '@/store/sideEffects';
import { loadVersion } from '@/store/sideEffectsV2';
import { ConnectedProps, MergeArguments } from '@/types';

import CommentingUpdates from './ComentingUpdates';

export type ProjectLoadingGateProps = {
  versionID: string;
  diagramID: string;
};

const ProjectLoadingGate: React.FC<ProjectLoadingGateProps & ConnectedProjectLoadingGateProps> = ({
  isProjectLoaded,
  loadProjectV2,
  loadProject,
  joinProjectChannel,
  loadThreads,
  setError,
  children,
}) => {
  const commenting = useFeature(FeatureFlag.COMMENTING);
  const dataRefactor = useFeature(FeatureFlag.DATA_REFACTOR);

  const loadProjectAndJoinChannel = React.useCallback(async () => {
    try {
      const skill = await (dataRefactor.isEnabled ? loadProjectV2() : loadProject());

      if (commenting.isEnabled && skill.projectID) {
        // TODO: move this into loadProject once FF removed
        await loadThreads(skill.projectID);
      }

      await joinProjectChannel(skill.projectID);
    } catch (e) {
      console.error(e);
      setError(e);
    }
  }, [loadProject, loadThreads, joinProjectChannel, setError]);

  React.useEffect(() => client.socket.global.watchForReconnected(joinProjectChannel), [joinProjectChannel]);

  return (
    <LoadingGate label="Project" isLoaded={isProjectLoaded} load={loadProjectAndJoinChannel}>
      <CommentingUpdates />
      {children}
    </LoadingGate>
  );
};

const mapStateToProps = {
  activeSkill: Skill.activeSkillSelector,
};

const mapDispatchToProps = {
  loadProjectV2: loadVersion,
  loadProject: loadSkill,
  setError: Modal.setError,
  joinProjectChannel: Project.setupProjectSocketConnection,
  loadThreads: Thread.loadThreads,
};

// eslint-disable-next-line no-shadow
const mergeProps = (
  ...[{ activeSkill }, { loadProject, loadProjectV2, joinProjectChannel, setError, loadThreads }, { versionID, diagramID }]: MergeArguments<
    typeof mapStateToProps,
    typeof mapDispatchToProps,
    ProjectLoadingGateProps
  >
) => ({
  setError,
  loadThreads,
  isProjectLoaded: !!activeSkill && activeSkill.id === versionID,
  loadProject: () => loadProject(versionID, diagramID),
  loadProjectV2: () => loadProjectV2(versionID, diagramID),
  joinProjectChannel: (projectID = activeSkill.projectID) => joinProjectChannel(projectID),
});

type ConnectedProjectLoadingGateProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps, typeof mergeProps>;

export default connect(mapStateToProps, mapDispatchToProps, mergeProps, { merge: false })(ProjectLoadingGate);
