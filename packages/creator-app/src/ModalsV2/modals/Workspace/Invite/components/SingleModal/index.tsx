import { Utils } from '@voiceflow/common';
import { BillingPeriod, UserRole } from '@voiceflow/internal';
import { Button, ButtonVariant, Flex, Members, Modal, Text, toast, withProvider } from '@voiceflow/ui';
import React from 'react';

import WorkspaceUI, { Hooks as WorkspaceHooks } from '@/components/Workspace';
import { TEAM_LIMIT } from '@/config/planLimitV2/editorSeats';
import * as Payment from '@/contexts/PaymentContext';
import * as Workspace from '@/ducks/workspace';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useDispatch, useSelector } from '@/hooks';
import { VoidInternalProps } from '@/ModalsV2/types';
import * as currency from '@/utils/currency';
import { isEditorUserRole } from '@/utils/role';

import { useDedupeInvites } from '../../hooks';
import * as S from './styles';

const SingleModal: React.FC<VoidInternalProps> = ({ api, type, opened, hidden, animated }) => {
  const [submitting, setSubmitting] = React.useState(false);
  const isPaidPlan = useSelector(WorkspaceV2.active.isOnPaidPlanSelector);
  const [invitees, setInvitees] = React.useState<Members.Types.Member[]>([]);
  const previousEditorSeats = useSelector(WorkspaceV2.active.usedEditorSeatsSelector);
  const allSeats = useSelector(WorkspaceV2.active.numberOfSeatsSelector);
  const prePaidSeats = allSeats - previousEditorSeats;
  const { isReady, updatePlanSubscriptionSeats } = Payment.usePaymentAPI();
  const sendInvite = useDispatch(Workspace.sendInviteToActiveWorkspace);
  const dedupeInvites = useDedupeInvites();
  const { unitPrice, billingPeriod } = WorkspaceHooks.useSubscriptionInfo();

  const { editors, viewers } = React.useMemo(
    () =>
      invitees.reduce<{ editors: number; viewers: number }>(
        (acc, invitee) => {
          const key = isEditorUserRole(invitee.role) ? 'editors' : 'viewers';

          return {
            ...acc,
            [key]: acc[key] + 1,
          };
        },
        { editors: 0, viewers: 0 }
      ),
    [invitees]
  );

  const onChangeRole = (member: Members.Types.Member, role: UserRole) => {
    setInvitees(Utils.array.replace(invitees, invitees.indexOf(member), { ...member, role }));
  };

  const onAddMembers = (emails: string[], role: UserRole) => {
    const newEmails = dedupeInvites(emails, invitees);

    setInvitees((prev) => [...prev, ...newEmails.map((email) => ({ name: null, email, role, image: null, creator_id: null }))]);
  };

  const newSeats = editors - (prePaidSeats ?? 0);

  const items = React.useMemo(() => {
    const result: { description: React.ReactNode; value: string }[] = [];
    if (!isReady || !unitPrice) return result;

    if (newSeats > 0) {
      result.push({
        description: `${newSeats} Editor seat${newSeats > 1 ? 's' : ''}`,
        value: isPaidPlan ? currency.formatUSD(newSeats * unitPrice) : 'Free',
      });
    }

    if (prePaidSeats > 0) {
      result.push({
        description: `${prePaidSeats} Editor seat${prePaidSeats > 1 ? 's' : ''} (pre-paid)`,
        value: isPaidPlan ? currency.formatUSD(0) : 'Free',
      });
    }

    result.push({ description: `${viewers} Viewer seats`, value: 'Free' });

    return result;
  }, [isReady, newSeats, editors, viewers, prePaidSeats, unitPrice, isPaidPlan]);

  const takenSeats = editors + previousEditorSeats;
  const isValid = takenSeats <= TEAM_LIMIT.increasableLimit;

  const handleSubmit = async () => {
    if (!isValid) return;

    setSubmitting(true);
    api.preventClose();

    try {
      if (newSeats > 0) {
        await updatePlanSubscriptionSeats(previousEditorSeats + editors);
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
      <Modal.Header border>Invite Members to Workspace</Modal.Header>

      <Flex alignItems="stretch">
        <S.MembersColumn>
          <WorkspaceUI.InviteByEmail onAddMembers={onAddMembers} />

          <S.MemberList>
            <Members.List members={invitees} inset hideLastDivider={false} canChangeRole onChangeRole={onChangeRole} showBadge={false} />
          </S.MemberList>

          <WorkspaceUI.TakenSeatsMessage small seats={takenSeats} error={!isValid} />
        </S.MembersColumn>
        <S.SummaryColumn>
          {isReady && unitPrice && items.length > 0 && (
            <WorkspaceUI.BillingSummary
              items={items}
              footer={{
                description: 'Total',
                value: isPaidPlan ? currency.formatUSD(unitPrice * invitees.length) : 'Free',
              }}
              header={{
                title: 'Summary',
                description: (
                  <>
                    {currency.formatUSD(unitPrice, { noDecimal: true })}
                    <Text color="#62778C" paddingLeft="3px">
                      per Editor, per {billingPeriod === BillingPeriod.ANNUALLY ? 'year' : 'month'}
                    </Text>
                  </>
                ),
              }}
            />
          )}
        </S.SummaryColumn>
      </Flex>

      <Modal.Footer gap={10} sticky>
        <Button variant={ButtonVariant.TERTIARY} squareRadius onClick={() => api.close()}>
          Cancel
        </Button>

        <Button
          variant={ButtonVariant.PRIMARY}
          onClick={handleSubmit}
          disabled={!invitees?.length || submitting || !isValid}
          width={126}
          isLoading={submitting}
        >
          Invite & Pay
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default withProvider(Payment.PaymentProvider)(SingleModal);
