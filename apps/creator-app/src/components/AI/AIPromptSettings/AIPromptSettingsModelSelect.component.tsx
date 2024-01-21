import { Utils } from '@voiceflow/common';
import { AIModel } from '@voiceflow/dtos';
import { Box, SectionV2, Select, ThemeColor, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { PRIVATE_LLM_MODELS } from '@/config';
import { ADVANCED_AI_MODELS, AI_MODEL_CONFIG_MAP } from '@/config/ai-model';
import { Permission } from '@/constants/permissions';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks';
import { usePaymentModal } from '@/hooks/modal.hook';
import { usePermission } from '@/hooks/permission';

interface IAIPromptSettingsModelSelect {
  value: AIModel;
  onValueChange: (value: AIModel) => void;
}

export const AIPromptSettingsModelSelect: React.FC<IAIPromptSettingsModelSelect> = ({ value, onValueChange }) => {
  const isTrial = useSelector(WorkspaceV2.active.isOnTrialSelector);
  const isEnterprise = useSelector(WorkspaceV2.active.isEnterpriseSelector);

  const advancedLLMModels = usePermission(Permission.ADVANCED_LLM_MODELS);

  const isReverseTrial = isTrial && !isEnterprise;

  const paymentModal = usePaymentModal();

  const options = React.useMemo(() => {
    return Object.values(AI_MODEL_CONFIG_MAP)
      .filter((model) => {
        if (model.deprecated) return false;

        return !PRIVATE_LLM_MODELS.size || PRIVATE_LLM_MODELS.has(model.type);
      })
      .map((model) => {
        const privilaged = (!advancedLLMModels.allowed || isReverseTrial) && ADVANCED_AI_MODELS.has(model.type);

        return {
          name: model.name,
          info: !PRIVATE_LLM_MODELS.size && model.info,
          value: model.type,
          disabled: model.disabled || privilaged,
          privilaged,
        };
      });
  }, [advancedLLMModels.allowed, isReverseTrial]);

  return (
    <SectionV2.Content pb={8}>
      <Select
        value={value}
        options={options}
        onSelect={onValueChange}
        getOptionKey={(option) => option.value}
        getOptionValue={(option) => option?.value}
        getOptionLabel={(model) => (model ? AI_MODEL_CONFIG_MAP[model].name : undefined)}
        renderOptionLabel={(model, _searchLabel, _getOptionLabel, _getOptionValue, config) => {
          const item = (
            <Box.FlexApart fullWidth>
              {model.name}

              <Box color={ThemeColor.SECONDARY} fontSize={13}>
                {model.info}
              </Box>
            </Box.FlexApart>
          );

          if (model.privilaged) {
            return (
              <TippyTooltip
                style={{ width: '100%' }}
                width={232}
                offset={[0, 24]}
                placement="left"
                interactive
                content={
                  <TippyTooltip.FooterButton
                    onClick={Utils.functional.chainVoid(config.close, () => paymentModal.openVoid({}))}
                    buttonText="Upgrade to Pro"
                  >
                    <b>{model.name}</b> is available on our paid plans.
                  </TippyTooltip.FooterButton>
                }
              >
                {item}
              </TippyTooltip>
            );
          }

          return item;
        }}
      />
    </SectionV2.Content>
  );
};
