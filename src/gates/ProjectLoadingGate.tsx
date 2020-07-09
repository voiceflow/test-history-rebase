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
import { ConnectedProps, MergeArguments } from '@/types';

export type ProjectLoadingGateProps = {
  versionID: string;
  diagramID: string;
};

const ProjectLoadingGate: React.FC<ProjectLoadingGateProps & ConnectedProjectLoadingGateProps> = ({
  isProjectLoaded,
  loadProject,
  joinProjectChannel,
  loadThreads,
  setError,
  children,
}) => {
  const commenting = useFeature(FeatureFlag.COMMENTING);

  const loadProjectAndJoinChannel = React.useCallback(async () => {
    try {
      await loadProject();
      if (commenting.isEnabled) {
        await loadThreads();
      }
      await joinProjectChannel();
    } catch (e) {
      setError(e);
    }
  }, [loadProject, loadThreads, joinProjectChannel, setError]);

  React.useEffect(() => client.socket.global.watchForReconnected(joinProjectChannel), [joinProjectChannel]);

  return (
    <LoadingGate label="Project" isLoaded={isProjectLoaded} load={loadProjectAndJoinChannel}>
      {children}
    </LoadingGate>
  );
};

const mapStateToProps = {
  activeSkill: Skill.activeSkillSelector,
};

const mapDispatchToProps = {
  loadProject: loadSkill,
  setError: Modal.setError,
  joinProjectChannel: Project.setupProjectSocketConnection,
  loadThreads: Thread.loadThreads,
};

// eslint-disable-next-line no-shadow
const mergeProps = (
  ...[{ activeSkill }, { loadProject, joinProjectChannel, loadThreads, setError }, { versionID, diagramID }]: MergeArguments<
    typeof mapStateToProps,
    typeof mapDispatchToProps,
    ProjectLoadingGateProps
  >
) => ({
  setError,
  isProjectLoaded: !!activeSkill && activeSkill.id === versionID,
  loadProject: () => loadProject(versionID, diagramID),
  joinProjectChannel: () => joinProjectChannel(versionID),
  loadThreads: () => loadThreads(versionID),
});

type ConnectedProjectLoadingGateProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps, typeof mergeProps>;

export default connect(mapStateToProps, mapDispatchToProps, mergeProps, { merge: false })(ProjectLoadingGate);
