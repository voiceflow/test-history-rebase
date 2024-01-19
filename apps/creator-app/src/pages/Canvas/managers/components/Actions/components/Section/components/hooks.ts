import { BaseNode } from '@voiceflow/base-types';
import { EmptyObject } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { SvgIconTypes } from '@voiceflow/ui';

import * as DiagramV2 from '@/ducks/diagramV2';
import * as Domain from '@/ducks/domain';
import { useSelector } from '@/hooks';
import { useCustomIntentMapSelector } from '@/hooks/intent.hook';
import type { ManagerGetter } from '@/pages/Canvas/contexts';
import { getCustomAPIActionLabel } from '@/utils/customApi';
import { transformVariablesToReadable } from '@/utils/slot';

interface ItemConfig {
  icon?: SvgIconTypes.Icon;
  isEmpty: boolean;
  placeholder: string;
  defaultName: string;
}

export const useItemConfig = (getManager: ManagerGetter, data: Realtime.NodeData<EmptyObject>): ItemConfig => {
  const manager = getManager(data.type);

  const intentMap = useCustomIntentMapSelector();
  const domainMap = useSelector(Domain.domainsMapSelector);
  const diagramMap = useSelector(DiagramV2.diagramMapSelector);
  const sharedNodes = useSelector(DiagramV2.sharedNodesSelector);
  const entitiesAndVariables = useSelector(DiagramV2.active.allSlotsAndVariablesNormalizedSelector);

  switch (data.type) {
    case Realtime.BlockType.GO_TO_INTENT: {
      const { intent: intentID } = data as Realtime.NodeData<Realtime.NodeData.GoToIntent>;

      const goToIntent = intentID ? intentMap[intentID] : null;

      return {
        icon: manager.icon,
        isEmpty: !goToIntent,
        defaultName: goToIntent ? `Go to '${goToIntent.name}' intent` : '',
        placeholder: 'Select go-to intent',
      };
    }

    case Realtime.BlockType.GO_TO_NODE: {
      const { goToNodeID, diagramID } = data as Realtime.NodeData<Realtime.NodeData.GoToNode>;

      const sharedNode = diagramID && goToNodeID ? sharedNodes[diagramID]?.[goToNodeID] ?? null : null;
      const name =
        (sharedNode?.type === Realtime.BlockType.COMBINED && sharedNode.name) || (sharedNode?.type === Realtime.BlockType.START && 'Start');

      return {
        icon: manager.icon,
        isEmpty: !sharedNode,
        defaultName: name ? `Go to '${name}' block` : 'Go to block',
        placeholder: 'Select go-to block',
      };
    }

    case Realtime.BlockType.GO_TO_DOMAIN: {
      const { domainID } = data as Realtime.NodeData<Realtime.NodeData.GoToDomain>;

      const domain = domainID ? domainMap[domainID] ?? null : null;

      return {
        icon: manager.icon,
        isEmpty: !domain,
        defaultName: domain?.name ? `Go to '${domain.name}' domain` : 'Go to domain',
        placeholder: 'Select go-to domain',
      };
    }

    case Realtime.BlockType.URL: {
      const { url } = data as Realtime.NodeData<Realtime.NodeData.Url>;

      return {
        icon: manager.icon,
        isEmpty: !url,
        defaultName: 'Open URL',
        placeholder: 'Add URL',
      };
    }

    case Realtime.BlockType.EXIT: {
      return {
        icon: manager.icon,
        isEmpty: false,
        defaultName: 'End conversation',
        placeholder: 'End conversation',
      };
    }

    case Realtime.BlockType.SETV2: {
      const { sets } = data as Realtime.NodeData<Realtime.NodeData.SetV2>;

      const nonEmptySet = sets.find((set) => set.variable);

      return {
        icon: manager.icon,
        isEmpty: !nonEmptySet,
        defaultName: nonEmptySet
          ? `Set {${nonEmptySet.variable}} to ${transformVariablesToReadable(String(nonEmptySet.expression) || "''", entitiesAndVariables.byKey)}`
          : '',
        placeholder: 'Select variable',
      };
    }

    case Realtime.BlockType.CODE: {
      const { code } = data as Realtime.NodeData<Realtime.NodeData.Code>;

      return {
        icon: manager.icon,
        isEmpty: !code,
        defaultName: 'Javascript',
        placeholder: 'Add javascript',
      };
    }

    case Realtime.BlockType.COMPONENT: {
      const { diagramID } = data as Realtime.NodeData<Realtime.NodeData.Component>;

      const diagram = diagramID ? diagramMap[diagramID] : null;

      return {
        icon: manager.icon,
        isEmpty: !diagram,
        defaultName: diagram?.name ?? 'Component',
        placeholder: 'Select component',
      };
    }

    case Realtime.BlockType.INTEGRATION: {
      const { selectedAction, selectedIntegration } = data as Realtime.NodeData<Realtime.NodeData.Integration>;

      if (selectedIntegration !== BaseNode.Utils.IntegrationType.CUSTOM_API) {
        return {
          icon: manager.icon,
          isEmpty: false,
          defaultName: selectedAction ?? '',
          placeholder: 'Add integration',
        };
      }

      const { url } = data as Realtime.NodeData<Realtime.NodeData.CustomApi>;

      return {
        icon: manager.getIcon?.(data as any) ?? manager.icon,
        isEmpty: !url,
        defaultName: `${getCustomAPIActionLabel(selectedAction)} request`,
        placeholder: 'Add request',
      };
    }

    default:
      return {
        icon: manager.icon,
        isEmpty: false,
        defaultName: (manager.factory?.()?.data.name as string) ?? '',
        placeholder: manager.label ?? 'Unknown action',
      };
  }
};
