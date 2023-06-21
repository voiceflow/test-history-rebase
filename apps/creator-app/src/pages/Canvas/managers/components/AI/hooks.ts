import { BaseUtils } from '@voiceflow/base-types';
import { toast } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import * as Errors from '@/config/errors';
import * as Session from '@/ducks/session';
import { useSelector } from '@/hooks';

export const useSourceCompletion = () => {
  const projectID = useSelector(Session.activeProjectIDSelector);

  return React.useCallback(
    async (source: BaseUtils.ai.DATA_SOURCE, params: BaseUtils.ai.AIModelParams & BaseUtils.ai.AIContextParams): Promise<string | null> => {
      try {
        Errors.assertProjectID(projectID);

        if (source === BaseUtils.ai.DATA_SOURCE.KNOWLEDGE_BASE) {
          const { output } = await client.testAPIClient.knowledgeBasePrompt({
            projectID,
            prompt: params.prompt,
          });

          return output;
        }

        const { output } = await client.testAPIClient.completion(params);

        return output;
      } catch (error: any) {
        if (error?.response?.status === 429) {
          toast.error('Too many requests, please wait and try again');
        } else {
          toast.error('Unable to generate response preview');
        }
      }

      return null;
    },
    []
  );
};
