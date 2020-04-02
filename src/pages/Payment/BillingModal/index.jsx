import React, { useEffect } from 'react';

import workspaceClient from '@/client/workspace';
import Modal, { ModalBody, ModalHeader } from '@/components/LegacyModal';
import { Spinner } from '@/components/Spinner';
import { ModalType } from '@/constants';
import { activeWorkspaceIDSelector, activeWorkspaceSelector } from '@/ducks/workspace';
import { connect } from '@/hocs';
import { useModals } from '@/hooks';
import { FadeLeftContainer } from '@/styles/animations/FadeHorizontal';

import CreditCardSection from './components/CreditCardSection';
import InvoiceInfoSection from './components/InvoiceInfoSection';

function BillingModal({ workspaceId }) {
  const { isOpened, toggle } = useModals(ModalType.BILLING);
  const [hasPaid, setHasPaid] = React.useState(false);
  const [invoiceData, setInvoiceData] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  const loadInvoiceData = async () => {
    setLoading(true);
    const data = await workspaceClient.getInvoice(workspaceId);
    if (!data.invoice && !data.upcoming) {
      setHasPaid(false);
    } else {
      setHasPaid(true);
      setInvoiceData(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isOpened === true) loadInvoiceData();
  }, [isOpened]);

  return (
    <Modal isOpen={isOpened} toggle={toggle}>
      <ModalHeader header="Billing" toggle={toggle} />
      <ModalBody className="pt-0">
        {loading ? (
          <Spinner />
        ) : (
          <FadeLeftContainer>
            {hasPaid && <CreditCardSection workspaceId={workspaceId} />}
            <InvoiceInfoSection title="Next Invoice" data={invoiceData.upcoming ? [invoiceData.upcoming] : []} />
            <InvoiceInfoSection title="Past Invoices" data={invoiceData.invoices || []} />
          </FadeLeftContainer>
        )}
      </ModalBody>
    </Modal>
  );
}

const mapStateToProps = {
  workspaceId: activeWorkspaceIDSelector,
  workspace: activeWorkspaceSelector,
};
export default connect(mapStateToProps)(BillingModal);
