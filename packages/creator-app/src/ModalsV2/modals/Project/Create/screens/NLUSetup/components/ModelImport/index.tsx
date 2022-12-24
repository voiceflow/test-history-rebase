import * as Platform from '@voiceflow/platform-config';
import { Box, Flex, Text, useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';

import * as NLU from '@/config/nlu';
import { Permission } from '@/config/permissions';
import { NLUImportOrigin } from '@/constants';
import { useNLUImport } from '@/hooks/nlu';
import { usePlanPermissionAction } from '@/hooks/planPermission';
import { useUpgradeModal } from '@/ModalsV2/hooks/helpers';
import { NLUImportModel } from '@/models';

import * as S from './styles';

interface ModelImportProps {
  platform: Platform.Constants.PlatformType;
  nluConfig: NLU.Base.Config;
  importModel: NLUImportModel | null;
  onImportModel: (importModel: NLUImportModel) => void;
  isImportLoading: boolean;
  setIsImportLoading: (isLoadingImport: boolean) => void;
}

const ModelImport: React.FC<ModelImportProps> = ({ platform, nluConfig, onImportModel, importModel, isImportLoading, setIsImportLoading }) => {
  const nluImport = useNLUImport({ nluType: nluConfig.type, platform, onImport: onImportModel });
  const upgradeModal = useUpgradeModal();

  const onImport = usePlanPermissionAction({
    onAction: () => nluImport.onUploadClick(NLUImportOrigin.PROJECT),
    onLimited: (limit) => upgradeModal.open(limit.getUpgradeModal()),
    permission: Permission.BULK_UPLOAD,
  });

  const textColor = isImportLoading ? 'rgba(98, 119, 140, 0.5)' : 'rgba(98, 119, 140, 1)';

  useDidUpdateEffect(() => {
    setIsImportLoading(nluImport.isImporting);
  }, [nluImport.isImporting]);

  return (
    <Box mt={12} fontSize={13}>
      {importModel ? (
        <Text color={textColor}>
          <Text color="#132144">{`${importModel.intents.length} `}</Text>intents containing{' '}
          <Text color="#132144">{`${importModel.slots.length} `}</Text> entities successfully imported.
        </Text>
      ) : (
        <Flex>
          <S.ImportLink disabled={isImportLoading} onClick={onImport}>
            {`Import ${nluConfig.nlps[0].import?.name} NLU model`}
          </S.ImportLink>

          <Box color="rgba(141, 162, 181, 0.5)" pl={8} pr={8}>
            •
          </Box>

          <Text color={textColor}>{`${nluImport.acceptedFileFormatsLabel} files supported`}</Text>
        </Flex>
      )}
    </Box>
  );
};

export default ModelImport;
