import { Spinner } from '@voiceflow/ui';
import React, { useEffect } from 'react';

import workspaceClient from '@/client/workspace';
import { SettingsSection } from '@/components/Settings';
import { Descriptor, TableContainer, TableHeader, TableRow } from '@/components/Table';
import * as Session from '@/ducks/session';
import { connect } from '@/hocs';
import { FadeLeftContainer } from '@/styles/animations';

import CreditCardSection from './CreditCardSection';

function BillingModal({ workspaceId }) {
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
    loadInvoiceData();
  }, []);

  const { invoices, upcoming } = invoiceData;

  return (
    <>
      <SettingsSection title="Billing">
        {loading ? (
          <Spinner isMd />
        ) : (
          <FadeLeftContainer>
            {invoices?.length ? (
              <TableContainer columns={[3, 8, 1]}>
                <TableHeader>
                  <span>Date</span>
                  <span>Subscription</span>
                  <span>Paid</span>
                </TableHeader>
                {invoices.map((invoice, index) => {
                  const { date, amount, items } = invoice;
                  return (
                    <TableRow key={index}>
                      <span>{date}</span>
                      <span>
                        {items.map((item, index) => (
                          <div key={index}>{item}</div>
                        ))}
                      </span>
                      <span>${amount}</span>
                    </TableRow>
                  );
                })}
              </TableContainer>
            ) : (
              <Descriptor>This workspace has no active subscription</Descriptor>
            )}
            {!!upcoming && (
              <Descriptor>
                Your <b>{upcoming.items}</b> renews on {upcoming.date}
              </Descriptor>
            )}
          </FadeLeftContainer>
        )}
      </SettingsSection>
      {hasPaid && (
        <SettingsSection title="Payment">
          <CreditCardSection workspaceId={workspaceId} />
        </SettingsSection>
      )}
    </>
  );
}

const mapStateToProps = {
  workspaceId: Session.activeWorkspaceIDSelector,
};
export default connect(mapStateToProps)(BillingModal);
