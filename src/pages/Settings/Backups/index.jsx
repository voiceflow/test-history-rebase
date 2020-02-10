import React from 'react';

import client from '@/client';
import Section from '@/components/Section';
import { toast } from '@/components/Toast';
import { setConfirm } from '@/ducks/modal';
import { goToCanvas } from '@/ducks/router';
import { activeProjectIDSelector } from '@/ducks/skill';
import { connect } from '@/hocs';
import { FormControl } from '@/pages/Canvas/components/Editor';

import BackupsList from './components/BackupsList';
import { ExplainationText } from './components/styled';

function Backups({ projectID, setConfirm, toggle, goToCanvas }) {
  const [loading, setLoading] = React.useState(true);
  const [versions, setVersions] = React.useState(null);
  const [liveVersion, setLiveVersion] = React.useState(null);
  const [liveVersionId, setLiveVersionId] = React.useState(null);

  const swapVersions = async (versionId) => {
    try {
      const { data } = await client.skill.restore(versionId);
      setConfirm({
        text: 'Successfully Restored Backup',
      });
      toggle();
      goToCanvas(data.skill_id, data.diagram);
    } catch (err) {
      toast.error('Unable to restore version');
    }
  };

  const confirmRestore = (versionId) => {
    setConfirm({
      warning: true,
      text:
        "This action can not be undone, will delete all your current work since your last backup, and will not change your skill's Amazon endpoint.",
      confirm: () => swapVersions(versionId),
    });
  };

  const fetchBackups = React.useCallback(async () => {
    try {
      const liveVersion = await client.project.getLiveVersion(projectID);
      const versions = (await client.project.getVersions(projectID)).filter((version) => {
        return version.skill_id !== liveVersion.live_version;
      });

      setVersions(versions);
      setLiveVersion(liveVersion.live_skill);
      setLiveVersionId(liveVersion.live_version);
    } catch (err) {
      toast.error('Unable to Fetch Backup Versions');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchBackups();
  }, []);

  return (
    <Section variant="secondary" dividers={false} header="Backups">
      <FormControl>
        <ExplainationText>Restore your skill to previous versions. A version is saved every time you upload your skill to Alexa</ExplainationText>
      </FormControl>
      <FormControl contentBottomUnits={4}>
        <BackupsList
          loading={loading}
          versions={versions}
          live_version={liveVersion}
          live_version_id={liveVersionId}
          confirmRestore={confirmRestore}
        />
      </FormControl>
    </Section>
  );
}

const mapStateToProps = {
  projectID: activeProjectIDSelector,
};

const mapDispatchToProps = {
  setConfirm,
  goToCanvas,
};

export default connect(mapStateToProps, mapDispatchToProps)(Backups);
