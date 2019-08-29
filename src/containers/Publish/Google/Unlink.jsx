import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Alert, Button } from 'reactstrap';

import { setConfirm, setError } from '@/ducks/modal';
import { resetDialogflowCredential } from '@/ducks/publish/google';

function UnlinkGoogle(props) {
  const { resetDialogflowCredential, setConfirm, google_id, setError } = props;

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
        try {
          setLoading(true);
          await resetDialogflowCredential();
          setConfirm({ text: <Alert className="mb-0">Successfully Unlinked Dialogflow Project</Alert>, cancel: false });
        } catch (err) {
          console.error(err);
          setError('Unable to unlink project');
        }
        setLoading(false);
      },
    });
  };

  return (
    <Button color="danger" onClick={unlink} disabled={loading}>
      Unlink Google Project
    </Button>
  );
}

export default connect(
  null,
  { resetDialogflowCredential, setConfirm, setError }
)(UnlinkGoogle);
