import { Box, BoxFlexCenter, ClickableText, LoadCircle, SvgIcon, toast } from '@voiceflow/ui';
import ObjectID from 'bson-objectid';
import moment from 'moment';
import React from 'react';

import { noIntentsGraphic } from '@/assets';
import client from '@/client';
import { SettingsSection } from '@/components/Settings';
import { Descriptor, TableContainer, TableHeader, TableRow } from '@/components/Table';
import * as Errors from '@/config/errors';
import { PlatformType } from '@/constants';
import * as Modal from '@/ducks/modal';
import * as Project from '@/ducks/project';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import { connect } from '@/hocs';
import { useSetup, useTrackingEvents } from '@/hooks';
import { getSettingsMetaProps } from '@/pages/Settings/constants';
import { FadeLeftContainer } from '@/styles/animations';
import { ConnectedProps } from '@/types';
import * as Sentry from '@/vendors/sentry';

type ProjectVersion = {
  versionID: string;
  created: string;
  platform: PlatformType;
};

const ProjectVersions: React.FC<ConnectedProjectVersions> = ({ projectID, activeVersionID, setConfirm, goToCanvas, platform }) => {
  const [loading, setLoading] = React.useState(true);
  const [versions, setVersions] = React.useState<ProjectVersion[]>([]);
  const { name } = getSettingsMetaProps(platform);

  const [trackingEvents] = useTrackingEvents();

  const swapVersions = async (versionID: string) => {
    if (!projectID) {
      Sentry.error(Errors.noActiveProjectID());
      toast.genericError();
      return;
    }

    try {
      await client.backup.restore(projectID, versionID);
      goToCanvas(versionID);
      toast.success('Successfully restored version');
    } catch (err) {
      toast.error('Unable to restore version');
    }
  };

  const confirmRestore = (versionID: string) => {
    setConfirm({
      warning: true,
      text: "This action can not be undone, will delete all your current work since your last backup, and will not change your skill's Amazon endpoint.",
      confirm: () => swapVersions(versionID),
    });
  };

  const fetchBackups = React.useCallback(async () => {
    if (!projectID) {
      Sentry.error(Errors.noActiveProjectID());
      toast.genericError();
      return;
    }

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

  useSetup(() => {
    trackingEvents.trackActiveProjectVersionPage();

    fetchBackups();
  });

  return (
    <SettingsSection title="All Versions">
      <Descriptor>New versions are created every time your project is uploaded to {name}.</Descriptor>
      {loading ? (
        <BoxFlexCenter minHeight={320}>
          <LoadCircle />
        </BoxFlexCenter>
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
                    {version.versionID === activeVersionID ? (
                      'Current'
                    ) : (
                      <ClickableText onClick={() => confirmRestore(version.versionID)}>Restore</ClickableText>
                    )}
                  </span>
                </TableRow>
              ))}
            </TableContainer>
          ) : (
            <BoxFlexCenter minHeight={320}>
              <Box textAlign="center">
                <img src={noIntentsGraphic} height={64} alt="no intents" />
                <Box mt={10}>No versions exist</Box>
              </Box>
            </BoxFlexCenter>
          )}
        </FadeLeftContainer>
      )}
    </SettingsSection>
  );
};

const mapStateToProps = {
  activeVersionID: Session.activeVersionIDSelector,
  projectID: Session.activeProjectIDSelector,
  platform: Project.activePlatformSelector,
};

const mapDispatchToProps = {
  setConfirm: Modal.setConfirm,
  goToCanvas: Router.goToCanvas,
};

export type ConnectedProjectVersions = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(ProjectVersions);
