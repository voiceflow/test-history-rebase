import { Spinner } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/config/permissions';
import { compose } from '@/hocs';
import { usePermission } from '@/hooks';

import Checkout from './Checkout';
import PaymentContainer from './components/PaymentContainer';
import { VIEWS, withPayment, withPaymentProvider } from './context';
import Details from './Details';

const Payment = ({
  payment: {
    state: { view, loading },
    actions: { setFocus },
  },
  focus,
}) => {
  const [isAllowed] = usePermission(Permission.UPGRADE_WORKSPACE);

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

  return (
    <PaymentContainer isLoading={loading.plan} notAllowed={!isAllowed}>
      {content}
    </PaymentContainer>
  );
};

// provider and consumer within the same component
export default compose(withPaymentProvider, withPayment)(Payment);
