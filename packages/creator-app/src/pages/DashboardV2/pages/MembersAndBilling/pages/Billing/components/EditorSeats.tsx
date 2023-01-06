import { Box, Button, SectionV2, Text } from '@voiceflow/ui';
import React from 'react';

import Page from '@/components/Page';
import Workspace from '@/components/Workspace';
import { Permission } from '@/config/permissions';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { usePermission, useSelector } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';

import CardDetails from './CardDetails';

const EditorSeats: React.OldFC = () => {
  const scheduleSeatModal = ModalsV2.useModal(ModalsV2.Billing.ScheduleSeatChange);

  const usedEditorSeats = useSelector(WorkspaceV2.active.usedEditorSeatsSelector);
  const usedViewerSeats = useSelector(WorkspaceV2.active.usedViewerSeatsSelector);
  const pricePerEditor = '$50';
  const cardDetails = '8787';
  const isEnterprise = useSelector(WorkspaceV2.active.isEnterpriseSelector);
  const isPaidPlan = useSelector(WorkspaceV2.active.isOnPaidPlanSelector);
  const nextBillingDate = '10 Jan 2023';
  const canManageSeats = usePermission(Permission.MANAGE_SEATS);

  return (
    <Page.Section
      mb={24}
      header={
        <Page.Section.Header>
          <Box.FlexApart>
            <div>
              <Page.Section.Title>Payment Overview</Page.Section.Title>

              <Page.Section.Description>
                {!isPaidPlan && (
                  <div>
                    This workspace has <Text color="#132144">{usedEditorSeats} Editor seats.</Text>
                  </div>
                )}

                {isEnterprise && `Want to make changes to your next billing cycle? Contact sales@voiceflow.com.`}

                {isPaidPlan && !isEnterprise && (
                  <>
                    Your next billing date is <Text color="#132144">{nextBillingDate}.</Text>
                  </>
                )}
              </Page.Section.Description>
            </div>

            {canManageSeats && (
              <Button variant={Button.Variant.SECONDARY} onClick={() => scheduleSeatModal.openVoid()}>
                Schedule Seat Change
              </Button>
            )}
          </Box.FlexApart>
        </Page.Section.Header>
      }
    >
      <SectionV2.SimpleSection headerProps={{ bottomUnit: 2 }}>
        <Box.FlexApart fullWidth>
          <Box.FlexAlignStart column gap={4}>
            <SectionV2.Title bold>Editor Seats</SectionV2.Title>

            {!isPaidPlan && <Workspace.TakenSeatsMessage />}

            {isEnterprise && (
              <div>
                <SectionV2.Description>{usedEditorSeats} </SectionV2.Description>
                <SectionV2.Description secondary> Editor seat{usedEditorSeats > 1 && 's'} being used in this workspace.</SectionV2.Description>
              </div>
            )}

            {isPaidPlan && !isEnterprise && (
              <div>
                <SectionV2.Description>{pricePerEditor} </SectionV2.Description>
                <SectionV2.Description secondary> per Editor, per month</SectionV2.Description>
              </div>
            )}
          </Box.FlexAlignStart>

          {cardDetails && <CardDetails>{cardDetails}</CardDetails>}
        </Box.FlexApart>
      </SectionV2.SimpleSection>

      <SectionV2.Divider inset />

      <SectionV2.SimpleSection headerProps={{ topUnit: 2, bottomUnit: 2 }} minHeight={50}>
        <SectionV2.Description>{usedEditorSeats} Editor seats</SectionV2.Description>
        <SectionV2.Description>{pricePerEditor}</SectionV2.Description>
      </SectionV2.SimpleSection>

      <SectionV2.Divider inset />

      <SectionV2.SimpleSection headerProps={{ topUnit: 2, bottomUnit: 2 }} minHeight={50}>
        <SectionV2.Description>{usedViewerSeats} Viewer seats</SectionV2.Description>
        <SectionV2.Description>Free</SectionV2.Description>
      </SectionV2.SimpleSection>

      <SectionV2.Divider inset />

      <SectionV2.SimpleSection headerProps={{ topUnit: 2, bottomUnit: 3.5 }}>
        <Box.FlexApart fullWidth>
          <SectionV2.Title bold>Total</SectionV2.Title>
          <SectionV2.Title bold fill={false}>
            Custom
          </SectionV2.Title>
        </Box.FlexApart>
      </SectionV2.SimpleSection>
    </Page.Section>
  );
};

export default EditorSeats;
