import { Alert, Spinner } from '@voiceflow/ui';
import React from 'react';

import * as Account from '@/ducks/account';
import { useAsyncMountUnmount, useDispatch } from '@/hooks';

import Migration from './Migration';

export const Stage = {
  LOADING: 0,
  FORM: 2,
  SUCCESS: 3,
};

export interface MigrateStagesProps {
  syncSelectedVendor: () => Promise<void>;
}

const MigrateStages: React.FC = () => {
  const syncSelectedVendor = useDispatch(Account.amazon.syncSelectedVendor);

  const [stage, setStage] = React.useState(Stage.LOADING);

  useAsyncMountUnmount(async () => {
    await syncSelectedVendor();

    setStage(Stage.FORM);
  });

  switch (stage) {
    case Stage.FORM:
      return <Migration onSuccess={() => setStage(Stage.SUCCESS)} />;
    case Stage.SUCCESS:
      return <Alert mb={16}>Your Assistant Has Been Successfully Updated!</Alert>;
    default:
      return <Spinner />;
  }
};

export default MigrateStages;
