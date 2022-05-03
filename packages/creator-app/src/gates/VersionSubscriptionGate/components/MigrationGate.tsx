import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import client from '@/client';
import LoadingGate from '@/components/LoadingGate';
import * as Router from '@/ducks/router';
import { AsyncActionError } from '@/ducks/utils';
import * as Version from '@/ducks/version';
import { useDispatch, useFeature, useRealtimeClient } from '@/hooks';
import logger from '@/utils/logger';

import { MigrationStatus, PROJECT_LOADING_GATE_LABEL } from '../constants';
import { VersionSubscriptionContext } from '../types';
import MigrationFailedWarning from './MigrationFailedWarning';
import MigrationInProgressWarning from './MigrationInProgressWarning';

export interface MigrationGateProps
  extends React.PropsWithChildren<{
    versionID: string;
    context: VersionSubscriptionContext | null;
    setContext: (context: VersionSubscriptionContext) => void;
  }> {}

const MigrationGate: React.FC<MigrationGateProps> = ({ versionID, context, setContext, children }) => {
  const realtimeClient = useRealtimeClient();
  const migrationSystem = useFeature(Realtime.FeatureFlag.MIGRATION_SYSTEM);

  const [status, setStatus] = React.useState(MigrationStatus.IDLE);

  const goToDashboard = useDispatch(Router.goToDashboard);
  const negotiateTargetVersion = useDispatch(Version.negotiateTargetVersion);

  const acceptContext = React.useCallback((result: Realtime.version.schema.NegotiateResultPayload) => {
    // handle case where the active version is not supported by the frontend code
    if (result.schemaVersion > Realtime.LATEST_SCHEMA_VERSION) {
      logger.error('migration target not supported', { target: result.schemaVersion, latest: Realtime.LATEST_SCHEMA_VERSION });

      window.location.reload();
      return;
    }

    setStatus(MigrationStatus.DONE);
    setContext({ workspaceID: result.workspaceID, projectID: result.projectID });
  }, []);

  const loadContext = React.useCallback(async () => {
    if (!migrationSystem.isEnabled) {
      try {
        const { projectID } = await client.api.version.get(versionID);
        const { teamID: workspaceID } = await client.api.project.get(projectID);

        setContext({ projectID, workspaceID });
      } catch {
        goToDashboard();
      }

      return;
    }

    try {
      const result = await negotiateTargetVersion(versionID);

      acceptContext(result);
    } catch (err) {
      logger.error('target schema negotiation failed', err);
      if (err instanceof AsyncActionError) {
        if (err.code === Realtime.ErrorCode.MIGRATION_IN_PROGRESS) {
          setStatus(MigrationStatus.WAITING);
          return;
        }

        if (err.code === Realtime.ErrorCode.SCHEMA_VERSION_NOT_SUPPORTED) {
          logger.error('migration target not supported', { latest: Realtime.LATEST_SCHEMA_VERSION });

          window.location.reload();
          return;
        }
      }

      setStatus(MigrationStatus.FAILED);
    }
  }, [versionID]);

  const reset = React.useCallback(async () => {
    setStatus(MigrationStatus.IDLE);
    await loadContext();
  }, [loadContext]);

  React.useEffect(() => {
    if (status !== MigrationStatus.IDLE) return undefined;

    return realtimeClient.onAction(Realtime.version.schema.migrate.started, ({ payload }) => {
      if (payload.versionID !== versionID) return;

      setStatus(MigrationStatus.RUNNING);
    });
  }, [status, versionID]);

  if (status === MigrationStatus.FAILED) {
    return <MigrationFailedWarning onReset={reset} />;
  }

  if (status === MigrationStatus.WAITING) {
    return <MigrationInProgressWarning versionID={versionID} onComplete={acceptContext} onFailed={reset} />;
  }

  return (
    <LoadingGate
      label={PROJECT_LOADING_GATE_LABEL}
      internalName={MigrationGate.name}
      isLoaded={!!context}
      load={loadContext}
      backgroundColor="#f9f9f9"
    >
      {children}
    </LoadingGate>
  );
};

export default MigrationGate;
