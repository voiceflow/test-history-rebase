import React from 'react';

import { Spinner } from '@/components/Spinner';
import { compose } from '@/utils/functional';

import Checkout from './Checkout';
import Details from './Details';
import PaymentContainer from './components/PaymentContainer';
import { VIEWS, withPayment, withPaymentProvider } from './context';

const Payment = ({
  payment: {
    state: { view, loading },
    actions: { setFocus },
  },
  focus,
}) => {
  React.useEffect(() => {
    if (focus) setFocus(focus);
  }, [focus]);

  let content;
  if (loading.plan) {
    content = <Spinner isEmpty isMd />;
  } else if (view === VIEWS.checkout) {
    content = <Checkout />;
  } else if (view === VIEWS.details) {
    return <Details />;
  }

  return <PaymentContainer isLoading={loading.plan}>{content}</PaymentContainer>;
};

// provider and consumer within the same component
export default compose(
  withPaymentProvider,
  withPayment
)(Payment);
