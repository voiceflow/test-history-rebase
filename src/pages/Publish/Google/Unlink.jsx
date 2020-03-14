import React, { useState } from 'react';
import { Button } from 'reactstrap';

import { setConfirm, setError } from '@/ducks/modal';
import { googleIDSelector, resetDialogflowCredential } from '@/ducks/publish/google';
import { connect } from '@/hocs';

function UnlinkGoogle(props) {
  const { resetDialogflowCredential, setConfirm, googleID, setError } = props;

  const [loading, setLoading] = useState(false);

  const unlink = () => {
    setConfirm({
      warning: true,
      text: `Are you sure you want to unlink the google project ${googleID}? You will be able to link a new google project afterwards.`,
      confirm: async () => {
        try {
          setLoading(true);
          await resetDialogflowCredential();
          setConfirm({ text: 'Successfully Unlinked Dialogflow Project', cancel: false });
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
  {
    googleID: googleIDSelector,
  },
  { resetDialogflowCredential, setConfirm, setError }
)(UnlinkGoogle);
