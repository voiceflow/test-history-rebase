import { Utils } from '@voiceflow/common';
import { BillingPeriod, UserRole } from '@voiceflow/internal';
import { Box, Button, ButtonVariant, Members, Modal, Spinner, System, Text, toast, withProvider } from '@voiceflow/ui';
import pluralize from 'pluralize';
import React from 'react';

import * as WorkspaceUI from '@/components/Workspace';
import * as Payment from '@/contexts/PaymentContext';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useDispatch } from '@/hooks/realtime';
import { useSelector } from '@/hooks/redux';
import { VoidInternalProps } from '@/ModalsV2/types';
import CardDetails from '@/pages/DashboardV2/pages/MembersAndBilling/pages/LegacyBilling/CardDetails';
import * as currency from '@/utils/currency';
import { isEditorUserRole } from '@/utils/role';

import { useDedupeInvites, useInviteLink } from '../../hooks';
import * as S from './styles';

const SingleModal: React.FC<VoidInternalProps> = ({ api, type, opened, hidden, animated }) => {
  const [invitees, setInvitees] = React.useState<Members.Types.Member[]>([]);
  const [submitting, setSubmitting] = React.useState(false);

  const isPaidPlan = useSelector(WorkspaceV2.active.isOnPaidPlanSelector);
  const numberOfSeats = useSelector(WorkspaceV2.active.numberOfSeatsSelector);
  const usedEditorSeats = useSelector(WorkspaceV2.active.usedEditorSeatsSelector);
  const editorPlanSeatLimits = useSelector(WorkspaceV2.active.editorPlanSeatLimitsSelector);

  const sendInvite = useDispatch(WorkspaceV2.sendInviteToActiveWorkspace);

  const inviteLink = useInviteLink();
  const dedupeInvites = useDedupeInvites();
  const paymentAPI = Payment.legacy.usePaymentAPI();
  const subscriptionInfo = WorkspaceUI.useSubscriptionInfo();

  const invitesMap = React.useMemo(
    () =>
      invitees.reduce<{ editors: number; viewers: number }>(
        (acc, invitee) => {
          const key = isEditorUserRole(invitee.role) ? 'editors' : 'viewers';

          return { ...acc, [key]: acc[key] + 1 };
        },
        { editors: 0, viewers: 0 }
      ),
    [invitees]
  );

  const takenSeats = invitesMap.editors + usedEditorSeats;
  // some pro workspaces have more seats than the plan allows
  const isValid = takenSeats <= Math.max(numberOfSeats, editorPlanSeatLimits);
  const paidSeats = Math.max(takenSeats - numberOfSeats, 0);

  const onChangeRole = (member: Members.Types.Member, role: UserRole) => {
    setInvitees(Utils.array.replace(invitees, invitees.indexOf(member), { ...member, role }));
  };

  const onAddMembers = (emails: string[], role: UserRole) => {
    const newEmails = dedupeInvites(emails, invitees);

    setInvitees((prev) => [...prev, ...newEmails.map((email) => ({ name: null, email, role, image: null, creator_id: null }))]);
  };

  const onRemoveMember = (member: Members.Types.Member) => {
    setInvitees((prev) => prev.filter((invitee) => invitee.email !== member.email));
  };

  const onSubmit = async () => {
    if (!isValid) return;

    setSubmitting(true);
    api.preventClose();

    try {
      if (paidSeats) {
        await paymentAPI.updatePlanSubscriptionSeats(numberOfSeats + paidSeats);
      }

      await Promise.all(invitees.map((invitee) => sendInvite({ email: invitee.email, role: invitee.role, showToast: false })));

      api.enableClose();
      api.close();
      toast.success('Invites sent!');
    } catch {
      setSubmitting(false);
      api.enableClose();
    }
  };

  const getItems = () => {
    const result: { description: React.ReactNode; value: string }[] = [];

    if (!paymentAPI.isReady || !subscriptionInfo.unitPrice) return result;

    if (paidSeats) {
      result.push({
        description: `${paidSeats} Editor ${pluralize('seat', paidSeats)}`,
        value: isPaidPlan ? currency.formatUSD(paidSeats * subscriptionInfo.unitPrice) : 'Free',
      });
    } else {
      const prepaidSeats = numberOfSeats - takenSeats;

      result.push({
        value: isPaidPlan ? currency.formatUSD(0) : 'Free',
        description: `${prepaidSeats} Editor ${pluralize('seat', prepaidSeats)} (pre-paid)`,
      });
    }

    result.push({ description: `${invitesMap.viewers} Viewer seats`, value: 'Free' });

    return result;
  };

  const items = getItems();

  return (
    <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} maxWidth={880}>
      <Modal.Header
        border
        actions={
          <System.IconButtonsGroup.Base>
            <System.IconButton.Base icon="copy" disabled={!inviteLink.link} onClick={inviteLink.onCopy} />
          </System.IconButtonsGroup.Base>
        }
      >
        Invite Members to Workspace
      </Modal.Header>

      {!paymentAPI.isReady ? (
        <Box minHeight={250} display="flex" alignItems="center" justifyContent="center">
          <Spinner borderLess />
        </Box>
      ) : (
        <>
          <Box.Flex minHeight={250} alignItems="stretch">
            <S.MembersColumn>
              <WorkspaceUI.InviteByEmail onAddMembers={onAddMembers} />

              <S.MemberList>
                <Members.List
                  inset
                  members={invitees}
                  onRemove={onRemoveMember}
                  showBadge={false}
                  onChangeRole={onChangeRole}
                  isEditorRole={isEditorUserRole}
                  hideLastDivider={false}
                  renderPendingLabel={({ role }) => `1 ${isEditorUserRole(role) ? 'Editor' : 'Viewer'} seat`}
                />
              </S.MemberList>

              <WorkspaceUI.TakenSeatsMessage small seats={takenSeats} error={!isValid} />
            </S.MembersColumn>

            <S.SummaryColumn>
              {subscriptionInfo.unitPrice && items.length > 0 && (
                <WorkspaceUI.BillingSummary
                  items={items}
                  header={{
                    title: 'Summary',
                    addon: paymentAPI.paymentSource && <CardDetails last4={paymentAPI.paymentSource.last4} brand={paymentAPI.paymentSource.brand} />,
                    description: (
                      <>
                        {currency.formatUSD(subscriptionInfo.unitPrice, { noDecimal: true })}

                        <Text color="#62778C" paddingLeft="3px">
                          per Editor, per {subscriptionInfo.billingPeriod === BillingPeriod.ANNUALLY ? 'year' : 'month'}
                        </Text>
                      </>
                    ),
                  }}
                  footer={{
                    value: isPaidPlan ? currency.formatUSD(subscriptionInfo.unitPrice * paidSeats) : 'Free',
                    description: 'Total',
                  }}
                />
              )}
            </S.SummaryColumn>
          </Box.Flex>

          <Modal.Footer gap={12} sticky>
            <Button variant={ButtonVariant.TERTIARY} squareRadius onClick={api.onClose}>
              Cancel
            </Button>

            <Button
              width={126}
              variant={ButtonVariant.PRIMARY}
              onClick={onSubmit}
              disabled={!invitees?.length || submitting || !isValid}
              isLoading={submitting}
            >
              {paidSeats ? 'Invite & Pay' : 'Invite'}
            </Button>
          </Modal.Footer>
        </>
      )}
    </Modal>
  );
};

export default withProvider(Payment.legacy.PaymentProvider)(SingleModal);
