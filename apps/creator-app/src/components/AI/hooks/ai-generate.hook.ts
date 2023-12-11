import { Utils } from '@voiceflow/common';
import { WorkspaceQuotaName } from '@voiceflow/dtos';
import { isNetworkError, logger } from '@voiceflow/ui';
import { toast, usePersistFunction } from '@voiceflow/ui-next';
import React from 'react';

import { assertWorkspaceID } from '@/config/errors';
import { Session, Workspace } from '@/ducks';
import { useDispatch, useSelector } from '@/hooks/store.hook';

import { AIGenerateServerErrorStatusCode } from '../ai.constant';

interface GenerateOptions<Item> {
  quantity: number;
  examples: Item[];
  requestID: string;
  workspaceID: string;
}

interface BaseGenerateProps {
  successGeneratedMessage: string;
}

interface AIGenerateOptions<Item> {
  examples: Item[];
  generate: (options: GenerateOptions<Item>) => Promise<Item[]>;
  onGenerated: (item: Item[]) => void | Promise<any>;
}

interface AIGenerateOptionsWithTransform<ExternalItem, InternalItem> extends BaseGenerateProps {
  examples: ExternalItem[];
  generate: (options: GenerateOptions<InternalItem>) => Promise<InternalItem[]>;
  transform: (items: ExternalItem[]) => InternalItem[];
  onGenerated: (item: InternalItem[]) => void | Promise<any>;
}

export interface IAIGenerate<Item> {
  fetching: boolean;
  requestID: string;
  onGenerate: (options: { quantity: number; examples?: Item[] }) => Promise<void>;
}

const useAIGetGenerateOptions = () => {
  const workspaceID = useSelector(Session.activeWorkspaceIDSelector);

  return React.useCallback(() => {
    assertWorkspaceID(workspaceID);

    return {
      requestID: Utils.id.cuid(),
      workspaceID,
    };
  }, []);
};

interface AIGenerate {
  <Item>(options: AIGenerateOptions<Item> & BaseGenerateProps): IAIGenerate<Item>;
  <ExternalItem, InternalItem>(options: AIGenerateOptionsWithTransform<ExternalItem, InternalItem>): IAIGenerate<ExternalItem>;
}

export const useAIGenerate: AIGenerate = ({
  generate,
  examples,
  transform = (value) => value,
  onGenerated,
  successGeneratedMessage,
}: AIGenerateOptions<unknown> & { transform?: (values: unknown[]) => unknown[]; successGeneratedMessage: string }): IAIGenerate<unknown> => {
  const reloadQuota = useDispatch(Workspace.refreshWorkspaceQuotaDetails);

  const getGenOptions = useAIGetGenerateOptions();
  const [fetching, setFetching] = React.useState(false);
  const [requestID, setRequestID] = React.useState('');

  const onGenerate = usePersistFunction(async (options: { quantity: number; examples?: unknown[] }) => {
    try {
      const generateOptions = getGenOptions();

      setFetching(true);
      setRequestID(generateOptions.requestID);

      if (document.activeElement && document.activeElement instanceof HTMLElement) {
        document.activeElement?.blur();
      }

      const items = await generate({
        ...options,
        ...generateOptions,
        examples: transform(options.examples?.length ? options.examples : examples),
      });

      reloadQuota(WorkspaceQuotaName.OPEN_AI_TOKENS);

      await onGenerated(items.slice(0, options.quantity))?.catch(Utils.functional.noop);

      toast.success(successGeneratedMessage, { isClosable: false });
    } catch (error) {
      logger.error(error);

      if (isNetworkError(error) && error.statusCode === AIGenerateServerErrorStatusCode.QUOTA_REACHED) {
        toast.error("You've reached your beta access token limit for AI Assist features", { isClosable: false });
        return;
      }

      toast.error('Unable to generate, try again', { isClosable: false });
    } finally {
      setFetching(false);
    }
  });

  return {
    fetching,
    requestID,
    onGenerate,
  };
};
