import { Spinner } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/config/permissions';
import { compose } from '@/hocs';
import { usePermission } from '@/hooks';

import Checkout from './Checkout';
import PaymentContainer from './components/PaymentContainer';
import { PaymentContextProps, VIEWS, withPayment, withPaymentProvider } from './context';
import Details from './Details';

interface PaymentProps {
  focus?: string;
  payment?: PaymentContextProps;
  onCheckout?: (message: string) => void;
}

const Payment: React.FC<PaymentProps> = ({ focus, payment }) => {
  const [isAllowed] = usePermission(Permission.UPGRADE_WORKSPACE);

  React.useEffect(() => {
    if (focus) payment?.actions.setFocus(focus);
  }, [focus]);

  let content;
  if (payment?.state.loading.plan) {
    content = <Spinner isEmpty isMd />;
  } else if (payment?.state.view === VIEWS.checkout) {
    content = <Checkout />;
  } else if (payment?.state.view === VIEWS.details) {
    return <Details />;
  }

  return (
    <PaymentContainer isLoading={!!payment?.state.loading.plan} notAllowed={!isAllowed}>
      {content}
    </PaymentContainer>
  );
};

// provider and consumer within the same component
export default compose(withPaymentProvider, withPayment)(Payment) as React.FC<PaymentProps>;
