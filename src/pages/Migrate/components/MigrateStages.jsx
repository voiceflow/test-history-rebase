import React from 'react';
import { Alert } from 'reactstrap';

import Button from '@/components/Button';
import { Spinner } from '@/components/Spinner';
import * as Account from '@/ducks/account';
import * as AlexaPublish from '@/ducks/publish/alexa';
import { connect } from '@/hocs';
import { useAsyncMountUnmount } from '@/hooks';

import MigrateForm from './MigrateForm';

export const Stage = {
  LOADING: 0,
  FORM: 2,
  SUCCESS: 3,
};

function MigrateStages({ checkAmazonAccount, syncVendors }) {
  const [stage, setStage] = React.useState(Stage.LOADING);
  const [error, setError] = React.useState(null);

  useAsyncMountUnmount(async () => {
    await checkAmazonAccount();
    await syncVendors();
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
  checkAmazonAccount: Account.checkAmazonAccount,
  syncVendors: AlexaPublish.syncVendors,
};

export default connect(null, mapDispatchToProps)(MigrateStages);
