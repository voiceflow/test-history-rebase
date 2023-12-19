import { BaseUtils } from '@voiceflow/base-types';
import { AIGPTModel } from '@voiceflow/dtos';
import type { IconName } from '@voiceflow/icons';
import { Box, Divider, HotKeys, Menu, Tooltip } from '@voiceflow/ui-next';
import React from 'react';

import { MenuItemWithTooltip } from '@/components/Menu/MenuItemWithTooltip/MenuItemWithTooltip.component';
import { PRIVATE_LLM_MODELS } from '@/config';
import { Permission } from '@/constants/permissions';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks';
import { useUpgradeModal } from '@/hooks/modal.hook';
import { usePermission } from '@/hooks/permission';

import * as C from '../Settings.constant';

export interface IModelSelect {
  referenceRef: React.MutableRefObject<HTMLElement | null>;
  onChange: (data: Partial<BaseUtils.ai.AIModelParams>) => void;
  onClose: () => void;
}

export const ModelMenu: React.FC<IModelSelect> = ({ referenceRef, onChange, onClose }) => {
  const advancedLLMModels = usePermission(Permission.ADVANCED_LLM_MODELS);
  const isEnterprise = useSelector(WorkspaceV2.active.isEnterpriseSelector);
  const isTrial = useSelector(WorkspaceV2.active.isOnTrialSelector);
  const upgradeModal = useUpgradeModal();

  const modelMenuItem = (model: AIGPTModel) => {
    const disabled = (!advancedLLMModels.allowed || isReverseTrial) && C.ADVANCED_LLM_MODELS.has(model);

    const onSelect = () => {
      if (disabled) return;
      onChange({ model: model as BaseUtils.ai.GPT_MODEL });
      onClose();
    };

    const modalConfig = C.getUpgradeModelConfig({ model });

    if (disabled) {
      return (
        <MenuItemWithTooltip
          key={C.MODEL_LABELS[model].name}
          label={C.MODEL_LABELS[model].name}
          prefixIconName={C.MODEL_LABELS[model].icon as IconName}
          hotKeys={<HotKeys hotKeys={[{ label: C.MODEL_LABELS[model].info }]} />}
          disabled={disabled}
          onClick={onSelect}
          tooltip={{ width: 160, placement: 'left' }}
        >
          {() => (
            <Box direction="column">
              <Tooltip.Caption>This model can only be used on a paid plan.</Tooltip.Caption>
              <Tooltip.Button onClick={() => upgradeModal.openVoid(modalConfig)}>Upgrade</Tooltip.Button>
            </Box>
          )}
        </MenuItemWithTooltip>
      );
    }

    return (
      <Menu.Item
        key={C.MODEL_LABELS[model].name}
        label={C.MODEL_LABELS[model].name}
        prefixIconName={C.MODEL_LABELS[model].icon as IconName}
        hotKeys={<HotKeys hotKeys={[{ label: C.MODEL_LABELS[model].info }]} />}
        disabled={disabled || C.MODEL_LABELS[model].disabled}
        onClick={onSelect}
      />
    );
  };

  const isReverseTrial = isTrial && !isEnterprise;
  return (
    <Menu width={`max(100%, ${referenceRef.current?.clientWidth ?? 0}px)`}>
      {(Object.keys(C.OPEN_AI_MODEL_LABELS) as AIGPTModel[])
        .filter((model) => {
          if (PRIVATE_LLM_MODELS) return PRIVATE_LLM_MODELS.has(model);
          return true;
        })
        .map((model) => modelMenuItem(model))}
      <Divider />
      {(Object.keys(C.ANTHROPIC_MODEL_LABELS) as AIGPTModel[])
        .filter((model) => {
          if (PRIVATE_LLM_MODELS) return PRIVATE_LLM_MODELS.has(model);
          return true;
        })
        .map((model) => modelMenuItem(model))}
    </Menu>
  );
};
