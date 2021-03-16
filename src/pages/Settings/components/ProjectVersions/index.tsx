import ObjectID from 'bson-objectid';
import moment from 'moment';
import React from 'react';

import client from '@/client';
import Box, { FlexCenter } from '@/components/Box';
import { LoadCircle } from '@/components/Loader';
import { SettingsSection } from '@/components/Settings';
import SvgIcon from '@/components/SvgIcon';
import { Descriptor, TableContainer, TableHeader, TableRow } from '@/components/Table';
import { ClickableText } from '@/components/Text/components/ClickableText';
import { toast } from '@/components/Toast';
import { PlatformType } from '@/constants';
import * as Modal from '@/ducks/modal';
import * as Router from '@/ducks/router';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { PLATFORM_SETTINGS_META } from '@/pages/Settings/constants';
import { FadeLeftContainer } from '@/styles/animations';
import { ConnectedProps } from '@/types';

type ProjectVersion = {
  versionID: string;
  created: string;
  platform: PlatformType;
};

const ProjectVersions: React.FC<ConnectedProjectVersions> = ({ projectID, currentVersionID, setConfirm, goToCanvas, platform }) => {
  const [loading, setLoading] = React.useState(true);
  const [versions, setVersions] = React.useState<ProjectVersion[]>([]);
  const { name } = PLATFORM_SETTINGS_META[platform];

  const swapVersions = async (versionId: string) => {
    try {
      await client.backup.restore(projectID, versionId);
      goToCanvas(versionId);
      toast.success('Successfully restored version');
    } catch (err) {
      toast.error('Unable to restore version');
    }
  };

  const confirmRestore = (versionId: string) => {
    setConfirm({
      warning: true,
      text:
        "This action can not be undone, will delete all your current work since your last backup, and will not change your skill's Amazon endpoint.",
      confirm: () => swapVersions(versionId),
    });
  };

  const fetchBackups = React.useCallback(async () => {
    try {
      // legacy backup system, requires design and refactor
      const dbVersions = (await client.api.project.getVersions(projectID)).filter(
        (version) => (version.platformData as any).status?.stage !== 'LIVE'
      );
      setVersions(
        dbVersions.map((version) => ({
          versionID: version._id,
          platform,
          created: ObjectID.isValid(version._id) ? new ObjectID(version._id).getTimestamp().toString() : '',
        }))
      );
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
    <SettingsSection title="All Versions">
      <Descriptor>New versions are created every time your project is uploaded to {name}.</Descriptor>
      {loading ? (
        <FlexCenter minHeight={320}>
          <LoadCircle />
        </FlexCenter>
      ) : (
        <FadeLeftContainer>
          {versions.length ? (
            <TableContainer topBorder columns={[3, 8, 2]} minHeight={320}>
              <TableHeader>
                <span>Date</span>
                <span>Name</span>
                <span>Version</span>
              </TableHeader>
              {versions.map((version, index) => (
                <TableRow key={index}>
                  <span>{moment(version.created).fromNow()}</span>
                  <span style={{ color: '#62778c' }}>
                    <Box display="inline-block" mr={6} mb={-1}>
                      <SvgIcon size={12} icon={version.platform === PlatformType.GOOGLE ? 'google' : 'amazon'} />
                    </Box>
                    Automatic
                  </span>
                  <span>
                    {version.versionID === currentVersionID ? (
                      'Current'
                    ) : (
                      <ClickableText onClick={() => confirmRestore(version.versionID)}>Restore</ClickableText>
                    )}
                  </span>
                </TableRow>
              ))}
            </TableContainer>
          ) : (
            <FlexCenter minHeight={320}>
              <Box textAlign="center">
                <img src="/images/no-intents.svg" height={64} alt="no intents" />
                <Box mt={10}>No versions exist</Box>
              </Box>
            </FlexCenter>
          )}
        </FadeLeftContainer>
      )}
    </SettingsSection>
  );
};

const mapStateToProps = {
  currentVersionID: Skill.activeSkillIDSelector,
  projectID: Skill.activeProjectIDSelector,
  platform: Skill.activePlatformSelector,
};

const mapDispatchToProps = {
  setConfirm: Modal.setConfirm,
  goToCanvas: Router.goToCanvas,
};

export type ConnectedProjectVersions = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(ProjectVersions);
