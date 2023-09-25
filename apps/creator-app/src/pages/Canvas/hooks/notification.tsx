import { toast } from '@voiceflow/ui';
import React from 'react';
import { useHistory } from 'react-router-dom';

export const useTokenToastNotification = () => {
  const history = useHistory();

  React.useEffect(() => {
    const searchParams = new URLSearchParams(history.location.search);

    if (searchParams.get('chargebee_payment_redirect') !== 'true') return;

    if (searchParams.get('state') === 'succeeded') {
      toast.success(
        <>
          Your purchase was successful! <br />
          The new tokens will be reflected on your workspace shortly.
        </>,
        { autoClose: false }
      );
    }

    searchParams.delete('chargebee_payment_redirect');
    searchParams.delete('id');
    searchParams.delete('state');
    history.replace({ search: searchParams.toString() });
  }, [history.location.search]);
};
