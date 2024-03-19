import * as Realtime from '@voiceflow/realtime-sdk';
import { toast } from '@voiceflow/ui';
import React from 'react';

import { LoadingGate } from '@/components/LoadingGate';
import * as Router from '@/ducks/router';
import * as Version from '@/ducks/versionV2';
import { useDispatch, useRealtimeClient } from '@/hooks';
import logger from '@/utils/logger';
import { AsyncActionError } from '@/utils/logux';

import WorkspaceOrProjectLoader from '../../WorkspaceOrProjectLoader';
import { MigrationStatus } from '../constants';
import { VersionSubscriptionContext } from '../types';
import MigrationFailedWarning from './MigrationFailedWarning';
import MigrationInProgressWarning from './MigrationInProgressWarning';

const MAX_RETRIES = 3;
const MIGRATION_RETRY_KEY = 'migration_retry_count';

const setMigrationRetries = (retries: number) => window.history.replaceState({ [MIGRATION_RETRY_KEY]: retries }, '');

export interface MigrationGateProps
  extends React.PropsWithChildren<{
    versionID: string;
    context: VersionSubscriptionContext | null;
    setContext: (context: VersionSubscriptionContext) => void;
  }> {}

const MigrationGate: React.FC<MigrationGateProps> = ({ versionID, context, setContext, children }) => {
  const realtimeClient = useRealtimeClient();

  const [status, setStatus] = React.useState(MigrationStatus.IDLE);
  const retryCount = window.history.state?.[MIGRATION_RETRY_KEY] ?? 0;

  const goToDashboard = useDispatch(Router.goToDashboard);
  const negotiateTargetVersion = useDispatch(Version.negotiateTargetVersion);

  const cancelMigration = React.useCallback(() => {
    toast.error('Something went wrong, please contact support if this issue persists.');
    goToDashboard();
  }, []);

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
    try {
      const result = await negotiateTargetVersion(versionID);

      acceptContext(result);
    } catch (err) {
      if (!(err instanceof AsyncActionError)) {
        setStatus(MigrationStatus.FAILED);
        return;
      }

      switch (err.code) {
        case Realtime.ErrorCode.MIGRATION_IN_PROGRESS:
          setStatus(MigrationStatus.WAITING);
          return;

        case Realtime.ErrorCode.SCHEMA_VERSION_NOT_SUPPORTED:
          logger.error('migration target not supported', { latest: Realtime.LATEST_SCHEMA_VERSION });

          if (retryCount === MAX_RETRIES) {
            cancelMigration();
            return;
          }

          setMigrationRetries(retryCount + 1);
          window.location.reload();
          return;

        default:
          setStatus(MigrationStatus.FAILED);
      }
    }
  }, [versionID, retryCount]);

  const reset = React.useCallback(async () => {
    if (retryCount === MAX_RETRIES) {
      cancelMigration();
      return;
    }

    setMigrationRetries(retryCount + 1);
    setStatus(MigrationStatus.IDLE);
    await loadContext();
  }, [loadContext, retryCount]);

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
    <LoadingGate load={loadContext} isLoaded={!!context} loader={<WorkspaceOrProjectLoader />} internalName={MigrationGate.name}>
      {children}
    </LoadingGate>
  );
};

export default MigrationGate;
