import { Utils } from '@voiceflow/common';
import { BillingPeriod, UserRole } from '@voiceflow/internal';
import { Box, Button, ButtonVariant, Members, Modal, Spinner, System, Text, toast, withProvider } from '@voiceflow/ui';
import pluralize from 'pluralize';
import React from 'react';

import * as WorkspaceUI from '@/components/Workspace';
import { TEAM_LIMIT } from '@/config/planLimitV2/editorSeats';
import * as Payment from '@/contexts/PaymentContext';
import * as Workspace from '@/ducks/workspace';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useDispatch } from '@/hooks/realtime';
import { useSelector } from '@/hooks/redux';
import { VoidInternalProps } from '@/ModalsV2/types';
import CardDetails from '@/pages/DashboardV2/pages/MembersAndBilling/pages/Billing/CardDetails';
import * as currency from '@/utils/currency';
import { isEditorUserRole } from '@/utils/role';

import { useDedupeInvites, useInviteLink } from '../../hooks';
import * as S from './styles';

const SingleModal: React.FC<VoidInternalProps> = ({ api, type, opened, hidden, animated }) => {
  const [invitees, setInvitees] = React.useState<Members.Types.Member[]>([]);
  const [submitting, setSubmitting] = React.useState(false);

  const isPaidPlan = useSelector(WorkspaceV2.active.isOnPaidPlanSelector);
  const numberOfSeats = useSelector(WorkspaceV2.active.numberOfSeatsSelector);
  const previousEditorSeats = useSelector(WorkspaceV2.active.usedEditorSeatsSelector);

  const sendInvite = useDispatch(Workspace.sendInviteToActiveWorkspace);

  const inviteLink = useInviteLink();
  const dedupeInvites = useDedupeInvites();
  const { unitPrice, billingPeriod } = WorkspaceUI.useSubscriptionInfo();
  const { isReady, updatePlanSubscriptionSeats, paymentSource } = Payment.usePaymentAPI();

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

  const items = React.useMemo(() => {
    const result: { description: React.ReactNode; value: string }[] = [];

    if (!isReady || !unitPrice) return result;

    if (invitesMap.editors > 0) {
      result.push({
        description: `${invitesMap.editors} Editor ${pluralize('seat', invitesMap.editors)}`,
        value: isPaidPlan ? currency.formatUSD(invitesMap.editors * unitPrice) : 'Free',
      });
    }

    result.push({
      value: isPaidPlan ? currency.formatUSD(0) : 'Free',
      description: `${numberOfSeats} Editor ${pluralize('seat', numberOfSeats)} (pre-paid)`,
    });

    result.push({ description: `${invitesMap.viewers} Viewer seats`, value: 'Free' });

    return result;
  }, [isReady, numberOfSeats, unitPrice, isPaidPlan, invitesMap]);

  const takenSeats = invitesMap.editors + previousEditorSeats;
  const isValid = takenSeats <= TEAM_LIMIT.increasableLimit;

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
      if (invitesMap.editors > 0) {
        await updatePlanSubscriptionSeats(numberOfSeats + invitesMap.editors);
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

      {!isReady ? (
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
                  canChangeRole
                  hideLastDivider={false}
                />
              </S.MemberList>

              <WorkspaceUI.TakenSeatsMessage small seats={takenSeats} error={!isValid} />
            </S.MembersColumn>

            <S.SummaryColumn>
              {unitPrice && items.length > 0 && (
                <WorkspaceUI.BillingSummary
                  items={items}
                  header={{
                    title: 'Summary',
                    addon: paymentSource && <CardDetails last4={paymentSource.last4} brand={paymentSource.brand} />,
                    description: (
                      <>
                        {currency.formatUSD(unitPrice, { noDecimal: true })}

                        <Text color="#62778C" paddingLeft="3px">
                          per Editor, per {billingPeriod === BillingPeriod.ANNUALLY ? 'year' : 'month'}
                        </Text>
                      </>
                    ),
                  }}
                  footer={{
                    value: isPaidPlan ? currency.formatUSD(unitPrice * invitees.length) : 'Free',
                    description: 'Total',
                  }}
                />
              )}
            </S.SummaryColumn>
          </Box.Flex>

          <Modal.Footer gap={10} sticky>
            <Button variant={ButtonVariant.TERTIARY} squareRadius onClick={() => api.close()}>
              Cancel
            </Button>

            <Button
              width={126}
              variant={ButtonVariant.PRIMARY}
              onClick={onSubmit}
              disabled={!invitees?.length || submitting || !isValid}
              isLoading={submitting}
            >
              Invite & Pay
            </Button>
          </Modal.Footer>
        </>
      )}
    </Modal>
  );
};

export default withProvider(Payment.PaymentProvider)(SingleModal);
