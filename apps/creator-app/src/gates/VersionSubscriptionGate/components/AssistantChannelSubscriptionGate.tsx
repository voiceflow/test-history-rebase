import { status as loguxStatus } from '@logux/client';
import { AnyAttachment, AnyResponseVariant, CardButton } from '@voiceflow/dtos';
import { FeatureFlag } from '@voiceflow/realtime-sdk';
import { Actions } from '@voiceflow/sdk-logux-designer';
import React from 'react';

import { designerClient } from '@/client/designer';
import LoadingGate from '@/components/LoadingGate';
import * as Session from '@/ducks/session';
import { useAssistantSubscription, useFeature, useRealtimeClient, useSelector, useStore } from '@/hooks';

import WorkspaceOrProjectLoader from '../../WorkspaceOrProjectLoader';

export interface AssistantChannelSubscriptionGateProps extends React.PropsWithChildren {
  projectID: string;
  versionID: string;
  workspaceID: string;
}

const AssistantChannelSubscriptionGate: React.FC<AssistantChannelSubscriptionGateProps> = ({ workspaceID, projectID, versionID, children }) => {
  const store = useStore();
  const client = useRealtimeClient();

  const httpAssistantCMS = useFeature(FeatureFlag.HTTP_ASSISTANT_CMS);
  const activeVersionID = useSelector(Session.activeVersionIDSelector)!;
  const activeProjectID = useSelector(Session.activeProjectIDSelector)!;

  const isSubscribed = useAssistantSubscription({ versionID, projectID, workspaceID }, [versionID]);

  const isLoaded = isSubscribed && versionID === activeVersionID;

  const [cmsFetched, setCMSFetched] = React.useState(!httpAssistantCMS.isEnabled || isLoaded);

  React.useEffect(() => {
    if (!httpAssistantCMS.isEnabled) {
      setCMSFetched(isLoaded);

      return undefined;
    }

    if (!isLoaded) {
      setCMSFetched(false);

      return undefined;
    }

    let skip = false;
    let fetching = false;
    let shouldSync = false;

    const fetchCMS = async () => {
      if (skip) return;

      fetching = true;

      const cms = await designerClient.assistant.exportCMS(activeVersionID);

      fetching = false;

      if (skip) return;

      const context = {
        assistantID: activeProjectID,
        environmentID: activeVersionID,
      };

      // attachments
      store.dispatch.local(Actions.Attachment.Replace({ data: (cms.attachments ?? []) as AnyAttachment[], context }));
      store.dispatch.local(Actions.CardButton.Replace({ data: (cms.cardButtons ?? []) as CardButton[], context }));

      // folder
      store.dispatch.local(Actions.Folder.Replace({ data: cms.folders ?? [], context }));

      // entity
      store.dispatch.local(Actions.Entity.Replace({ data: cms.entities ?? [], context }));
      store.dispatch.local(Actions.EntityVariant.Replace({ data: cms.entityVariants ?? [], context }));

      // variable
      store.dispatch.local(Actions.Variable.Replace({ data: cms.variables ?? [], context }));

      // intent
      store.dispatch.local(Actions.Intent.Replace({ data: cms.intents ?? [], context }));
      store.dispatch.local(Actions.Utterance.Replace({ data: cms.utterances ?? [], context }));
      store.dispatch.local(Actions.RequiredEntity.Replace({ data: cms.requiredEntities ?? [], context }));

      // response
      store.dispatch.local(Actions.Response.Replace({ data: cms.responses ?? [], context }));
      store.dispatch.local(Actions.ResponseDiscriminator.Replace({ data: cms.responseDiscriminators ?? [], context }));
      store.dispatch.local(Actions.ResponseVariant.Replace({ data: (cms.responseVariants ?? []) as AnyResponseVariant[], context }));
      store.dispatch.local(Actions.ResponseAttachment.Replace({ data: cms.responseAttachments ?? [], context }));

      // function
      store.dispatch.local(Actions.Function.Replace({ data: cms.functions ?? [], context }));
      store.dispatch.local(Actions.FunctionPath.Replace({ data: cms.functionPaths ?? [], context }));
      store.dispatch.local(Actions.FunctionVariable.Replace({ data: cms.functionVariables ?? [], context }));

      // assistant - should be last
      store.dispatch.local(Actions.Assistant.AddOne({ data: cms.assistant, context: { workspaceID: cms.assistant.workspaceID } }));

      setCMSFetched(true);
    };

    const unsubscribe = loguxStatus(client, async (status) => {
      shouldSync = status === 'disconnected' || shouldSync;

      if (status === 'synchronized' && shouldSync && !fetching) {
        fetchCMS();
        shouldSync = false;
      }
    });

    fetchCMS();

    return () => {
      skip = true;
      unsubscribe();
    };
  }, [isLoaded, httpAssistantCMS.isEnabled]);

  return (
    <LoadingGate
      label="Assistant"
      isLoaded={isLoaded && cmsFetched}
      component={WorkspaceOrProjectLoader}
      internalName={AssistantChannelSubscriptionGate.name}
    >
      {children}
    </LoadingGate>
  );
};

export default React.memo(AssistantChannelSubscriptionGate);
