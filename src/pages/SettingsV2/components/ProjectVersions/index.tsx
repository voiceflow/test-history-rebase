import moment from 'moment';
import React from 'react';

import client from '@/client';
import { ProjectVersion } from '@/client/project';
import { FlexCenter } from '@/components/Flex';
import { LoadCircle } from '@/components/Loader';
import SvgIcon from '@/components/SvgIcon';
import { ClickableText } from '@/components/Text/components/ClickableText';
import { toast } from '@/components/Toast';
import * as Modal from '@/ducks/modal';
import * as Router from '@/ducks/router';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { ContentSection } from '@/pages/SettingsV2/components/SettingsContent/components';
import { PLATFORM_SETTINGS_META } from '@/pages/SettingsV2/constants';
import { FadeLeftContainer } from '@/styles/animations';
import { ConnectedProps } from '@/types';

import { Descriptor, IconContainer, TableContainer, TableHeader, TableRow } from './components';

const ProjectVersions: React.FC<ConnectedProjectVersions> = ({ projectID, setConfirm, goToCanvas, platform }) => {
  const [loading, setLoading] = React.useState(true);
  const [versions, setVersions] = React.useState<ProjectVersion[]>([]);
  const { name } = PLATFORM_SETTINGS_META[platform];

  const swapVersions = async (versionId: string) => {
    try {
      const data = await client.skill.restore(versionId);
      toast.success('Successfully restored version');
      goToCanvas(data.skill_id, data.diagram);
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
      const liveVersion = await client.project.getLiveVersion(projectID);
      const versions = (await client.project.getVersions(projectID)).filter((version: any) => {
        return version.skill_id !== liveVersion.live_version;
      });

      setVersions(versions);
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
    <ContentSection title="All Versions">
      <Descriptor>New versions are created every time your project is uploaded to {name}.</Descriptor>
      <TableContainer>
        {loading ? (
          <IconContainer>
            <LoadCircle />
          </IconContainer>
        ) : (
          <FadeLeftContainer>
            {versions.length ? (
              <>
                <TableHeader>
                  <span>Date</span>
                  <span>Name</span>
                  <span>Version</span>
                </TableHeader>
                {versions.map((version: ProjectVersion, i: number) => {
                  return (
                    <TableRow key={i}>
                      <span>{moment(version.created).fromNow()}</span>
                      <span style={{ color: '#62778c' }}>
                        <SvgIcon size={12} icon={version.platform === 'google' ? 'google' : 'amazon'} />
                        Automatic
                      </span>
                      <span>
                        <ClickableText onClick={() => confirmRestore(version.skill_id)}>Restore</ClickableText>
                      </span>
                    </TableRow>
                  );
                })}
              </>
            ) : (
              <IconContainer>
                <div>
                  <FlexCenter>
                    <img src="/images/no-intents.svg" height={64} alt="no intents" />
                  </FlexCenter>
                  <FlexCenter style={{ marginTop: '10px' }}>No versions exist</FlexCenter>
                </div>
              </IconContainer>
            )}
          </FadeLeftContainer>
        )}
      </TableContainer>
    </ContentSection>
  );
};

const mapStateToProps = {
  projectID: Skill.activeProjectIDSelector,
  platform: Skill.activePlatformSelector,
};

const mapDispatchToProps = {
  setConfirm: Modal.setConfirm,
  goToCanvas: Router.goToCanvas,
};

export type ConnectedProjectVersions = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(ProjectVersions);
