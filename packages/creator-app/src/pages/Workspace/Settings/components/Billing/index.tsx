import { Spinner } from '@voiceflow/ui';
import React, { useEffect } from 'react';

import workspaceClient from '@/client/workspace';
import { SettingsSection } from '@/components/Settings';
import { Descriptor, TableContainer, TableHeader, TableRow } from '@/components/Table';
import * as Session from '@/ducks/session';
import { useSelector } from '@/hooks/redux';
import { Billing } from '@/models/Billing';
import { FadeLeftContainer } from '@/styles/animations';

import CreditCardSection from './CreditCardSection';

const BillingModal: React.FC = () => {
  const workspaceId = useSelector(Session.activeWorkspaceIDSelector)!;

  const [hasPaid, setHasPaid] = React.useState(false);
  const [invoiceData, setInvoiceData] = React.useState<Billing>({ invoices: null, upcoming: null });
  const [loading, setLoading] = React.useState(false);

  const loadInvoiceData = async () => {
    setLoading(true);
    const data = await workspaceClient.getInvoice(workspaceId);
    if (!data.invoices && !data.upcoming) {
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
            {hasPaid ? (
              <>
                <TableContainer columns={[3, 8, 1]}>
                  <TableHeader>
                    <span>Date</span>
                    <span>Subscription</span>
                    <span>Paid</span>
                  </TableHeader>
                  {invoices!.map((invoice, index) => {
                    const { date, amount, items } = invoice;
                    return (
                      <TableRow key={index} hasBorder>
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
                <Descriptor>
                  Your <b>{upcoming!.items}</b> renews on {upcoming!.date}
                </Descriptor>
              </>
            ) : (
              <Descriptor>This workspace has no active subscription</Descriptor>
            )}
          </FadeLeftContainer>
        )}
      </SettingsSection>
      {!loading && hasPaid && (
        <SettingsSection title="Payment">
          <CreditCardSection workspaceId={workspaceId} />
        </SettingsSection>
      )}
    </>
  );
};

export default BillingModal;
