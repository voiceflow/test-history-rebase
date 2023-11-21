import { BaseUtils } from '@voiceflow/base-types';
import { System, toast } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import * as Errors from '@/config/errors';
import { REQUEST_MORE_TOKENS } from '@/constants';
import * as Session from '@/ducks/session';
import { useSelector } from '@/hooks';

export const showLLMError = (defaultMessage: string, error: any): null => {
  if (error?.response?.status === 429) {
    toast.error('Too many requests, please wait and try again');
  } else if (error?.response?.status === 402) {
    toast.error(
      <>
        Out of tokens. <System.Link.Anchor href={REQUEST_MORE_TOKENS}>Request More Tokens.</System.Link.Anchor>
      </>,
      {
        autoClose: false,
      }
    );
  } else {
    toast.error(defaultMessage);
  }

  return null;
};

export const useSourceCompletion = () => {
  const projectID = useSelector(Session.activeProjectIDSelector);
  const versionID = useSelector(Session.activeVersionIDSelector);
  const workspaceID = useSelector(Session.activeWorkspaceIDSelector);

  return React.useCallback(
    async (source: BaseUtils.ai.DATA_SOURCE, params: BaseUtils.ai.AIModelParams & BaseUtils.ai.AIKnowledgeContextParams): Promise<string | null> => {
      try {
        Errors.assertProjectID(projectID);
        Errors.assertVersionID(versionID);
        Errors.assertWorkspaceID(workspaceID);

        if (source === BaseUtils.ai.DATA_SOURCE.KNOWLEDGE_BASE) {
          const { output } = await client.testAPIClient.knowledgeBase(workspaceID, {
            settings: params,
            projectID,
            versionID,
            question: params.prompt,
            instruction: params.instruction,
          });

          return output;
        }

        const { output } = await client.testAPIClient.completion(workspaceID, params);

        return output;
      } catch (error: any) {
        return showLLMError('Unable to generate response preview', error);
      }
    },
    []
  );
};
