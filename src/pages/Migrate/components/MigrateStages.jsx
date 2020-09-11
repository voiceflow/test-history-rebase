import React from 'react';
import { Alert } from 'reactstrap';

import Button from '@/components/Button';
import { Spinner } from '@/components/Spinner';
import { FeatureFlag } from '@/config/features';
import * as Account from '@/ducks/account';
import { syncSelectedVendor } from '@/ducks/account/sideEffectsV2';
import * as AlexaPublish from '@/ducks/publish/alexa';
import { connect } from '@/hocs';
import { useAsyncMountUnmount, useFeature } from '@/hooks';

import MigrateForm from './MigrateForm';

export const Stage = {
  LOADING: 0,
  FORM: 2,
  SUCCESS: 3,
};

function MigrateStages({ checkAmazonAccount, syncVendors, syncSelectedVendor }) {
  const [stage, setStage] = React.useState(Stage.LOADING);
  const [error, setError] = React.useState(null);

  const dataRefactor = useFeature(FeatureFlag.DATA_REFACTOR);

  useAsyncMountUnmount(async () => {
    if (dataRefactor.isEnabled) {
      await syncSelectedVendor();
    } else {
      await checkAmazonAccount();
      await syncVendors();
    }

    setStage(Stage.FORM);
  });

  if (error) {
    return (
      <>
        <Alert color="danger" className="mb-3">
          {error}
        </Alert>
        <Button onClick={() => setError(null)}>Reset</Button>
      </>
    );
  }

  switch (stage) {
    case Stage.FORM:
      return <MigrateForm onError={setError} onSuccess={() => setStage(Stage.SUCCESS)} />;
    case Stage.SUCCESS:
      return <Alert>Your Project Has Been Successfully Updated</Alert>;
    default:
      return <Spinner />;
  }
}

const mapDispatchToProps = {
  syncVendors: AlexaPublish.syncVendors,
  checkAmazonAccount: Account.checkAmazonAccount,
  syncSelectedVendor,
};

export default connect(null, mapDispatchToProps)(MigrateStages);
