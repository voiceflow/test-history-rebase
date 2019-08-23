import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Alert, Button } from 'reactstrap';

import { setConfirm } from '@/ducks/modal';
import { resetDialogflowCredential } from '@/ducks/publish/google';

function UnlinkGoogle(props) {
  const { resetDialogflowCredential, setConfirm, google_id } = props;

  const [loading, setLoading] = useState(false);

  const unlink = () => {
    setConfirm({
      warning: true,
      text: (
        <Alert color="danger" className="mb-0">
          Are you sure you want to unlink the google project {google_id}? You will be able to link a new google project afterwards.
        </Alert>
      ),
      confirm: async () => {
        setLoading(true);
        await resetDialogflowCredential();
        setLoading(false);
      },
    });
  };

  return (
    <Button color="danger" onClick={unlink}>
      {loading ? <span className="loader" /> : 'Unlink Google Project'}
    </Button>
  );
}

export default connect(
  null,
  { resetDialogflowCredential, setConfirm }
)(UnlinkGoogle);
